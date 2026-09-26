/* Bergstone Keramiksan — in-house 360° panorama viewer (WebGL2, no dependencies).
   A full-screen triangle; the fragment shader turns every pixel into a view ray and samples
   the equirectangular photo, so the projection is exact and there is no sphere mesh or seam.
   Angles follow the tour data: pan + = turn left, tilt + = up, fov = diagonal, in degrees. */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform mat3 uRotA;
uniform mat3 uRotB;
uniform vec2 uTanA;
uniform vec2 uTanB;
uniform vec2 uRes;
uniform float uMix;
out vec4 outColor;
const float PI = 3.14159265358979;

vec4 equi(sampler2D tex, vec3 d) {
  vec2 uv = vec2(0.5 + atan(d.x, -d.z) / (2.0 * PI), 0.5 - asin(clamp(d.y, -1.0, 1.0)) / PI);
  // Derivatives wrapped across the ±180° seam keep mip selection correct there
  vec2 dx = dFdx(uv), dy = dFdy(uv);
  dx.x -= floor(dx.x + 0.5);
  dy.x -= floor(dy.x + 0.5);
  return textureGrad(tex, uv, dx, dy);
}

void main() {
  vec2 p = gl_FragCoord.xy / uRes * 2.0 - 1.0;
  vec4 a = equi(uTexA, uRotA * normalize(vec3(p * uTanA, -1.0)));
  if (uMix <= 0.0) { outColor = a; return; }
  vec4 b = equi(uTexB, uRotB * normalize(vec3(p * uTanB, -1.0)));
  outColor = mix(a, b, uMix);
}`;

const DEG = Math.PI / 180;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const wrap180 = (a) => ((((a + 180) % 360) + 360) % 360) - 180;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t) => 1 - (1 - t) ** 3;
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Column-major rotation R = Ry(pan) · Rx(tilt). */
function rotation(pan, tilt) {
  const p = pan * DEG, t = tilt * DEG;
  const cp = Math.cos(p), sp = Math.sin(p), ct = Math.cos(t), st = Math.sin(t);
  return new Float32Array([cp, 0, -sp, sp * st, ct, cp * st, sp * ct, -st, cp * ct]);
}

/** tan of the half horizontal/vertical FOV for a diagonal FOV at a given aspect. */
function halfTans(fov, aspect) {
  const ty = Math.tan((fov * DEG) / 2) / Math.hypot(aspect, 1);
  return [ty * aspect, ty];
}

export function isSupported() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    const ok = !!gl && typeof createImageBitmap === 'function';
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

export class PanoViewer {
  constructor(canvas, { minFov = 30, maxFov = 115, onFrame, onInteract, onScrollIntent } = {}) {
    this.canvas = canvas;
    this.minFov = minFov;
    this.maxFov = maxFov;
    this.onFrame = onFrame;
    this.onInteract = onInteract;
    this.onScrollIntent = onScrollIntent;

    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
    if (!gl) throw new Error('WebGL2 unavailable');
    this.gl = gl;
    this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    this.aniso = gl.getExtension('EXT_texture_filter_anisotropic');
    this.maxAniso = this.aniso ? Math.min(8, gl.getParameter(this.aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)) : 1;
    this.#initProgram();

    this.a = null;               // { rec, cam } — visible layer
    this.b = null;               // incoming layer during a cross-fade
    this.mix = 0;
    this.cache = new Map();      // url -> { promise, tex, used }
    this.tweens = new Set();
    this.pointers = new Map();
    this.velocity = { pan: 0, tilt: 0 };
    this.autorotate = { speed: -2.4, delay: 4000 };   // deg/s, idle ms
    this.lastInput = performance.now();
    this.running = false;
    this.interactive = true;
    this.raf = 0;
    this.lastTime = 0;
    this.cssW = 1;
    this.cssH = 1;

    this.tick = this.tick.bind(this);
    this.#bindInput();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); this.lost = true; this.stop(); });
  }

  /* ---------- GL setup ---------- */
  #initProgram() {
    const gl = this.gl;
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    this.prog = prog;
    this.loc = Object.fromEntries(['uTexA', 'uTexB', 'uRotA', 'uRotB', 'uTanA', 'uTanB', 'uRes', 'uMix'].map((n) => [n, gl.getUniformLocation(prog, n)]));

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(prog);
    gl.uniform1i(this.loc.uTexA, 0);
    gl.uniform1i(this.loc.uTexB, 1);
  }

  /* ---------- Textures ---------- */
  /** Fetch, decode off the main thread and upload with mipmaps. Cached per URL. */
  texture(url) {
    const hit = this.cache.get(url);
    if (hit) { hit.used = performance.now(); return hit.promise; }
    const rec = { url, used: performance.now(), tex: null };
    rec.promise = (async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      const bitmap = await createImageBitmap(await res.blob());
      const gl = this.gl;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (this.aniso) gl.texParameterf(gl.TEXTURE_2D, this.aniso.TEXTURE_MAX_ANISOTROPY_EXT, this.maxAniso);
      bitmap.close();
      rec.tex = tex;
      this.#evict();
      return rec;
    })();
    rec.promise.catch(() => this.cache.delete(url));
    this.cache.set(url, rec);
    return rec.promise;
  }

  /** Keep GPU memory bounded: the visible layers plus the most recently used textures. */
  #evict(keep = 3) {
    const pinned = new Set([this.a?.rec, this.b?.rec]);
    const loaded = [...this.cache.values()].filter((r) => r.tex && !pinned.has(r)).sort((x, y) => y.used - x.used);
    loaded.slice(keep).forEach((r) => { this.gl.deleteTexture(r.tex); this.cache.delete(r.url); });
  }

  /** Free every texture (tour closed). */
  release() {
    this.tweens.clear();
    this.a = this.b = null;
    this.mix = 0;
    for (const r of this.cache.values()) if (r.tex) this.gl.deleteTexture(r.tex);
    this.cache.clear();
  }

  /* ---------- Camera ---------- */
  get cam() { return this.a?.cam; }

  show(rec, view) {
    this.a = { rec, cam: { pan: view.pan, tilt: view.tilt, fov: clamp(view.fov, this.minFov, this.maxFov) } };
    this.b = null;
    this.mix = 0;
    this.invalidate();
  }

  /** Animate the visible camera; resolves when done. */
  turnTo(view, duration = 600) {
    this.#cancel('camera');
    const cam = this.a.cam;
    const from = { ...cam };
    const to = { pan: from.pan + wrap180(view.pan - from.pan), tilt: view.tilt ?? from.tilt, fov: clamp(view.fov ?? from.fov, this.minFov, this.maxFov) };
    return this.#tween('camera', reduceMotion() ? 0 : duration, easeInOut, (k) => {
      cam.pan = from.pan + (to.pan - from.pan) * k;
      cam.tilt = from.tilt + (to.tilt - from.tilt) * k;
      cam.fov = from.fov + (to.fov - from.fov) * k;
    });
  }

  zoomBy(factor, duration = 260) {
    if (!this.a) return;
    return this.turnTo({ pan: this.a.cam.pan, tilt: this.a.cam.tilt, fov: this.a.cam.fov * factor }, duration);
  }

  /** Cross-fade to another room: the old view keeps leaning in, the new one settles out of a slight zoom. */
  crossfade(rec, view, { duration = 700, inScale = 0.84, outScale = 0.8 } = {}) {
    this.#cancel('camera');
    const from = this.a.cam;
    const out = { ...from };
    const target = { pan: view.pan, tilt: view.tilt, fov: clamp(view.fov, this.minFov, this.maxFov) };
    this.b = { rec, cam: { ...target, fov: target.fov * inScale } };
    const incoming = this.b.cam;
    return this.#tween('fade', reduceMotion() ? 0 : duration, easeInOut, (k) => {
      this.mix = k;
      from.fov = out.fov * (1 + (outScale - 1) * k);
      incoming.fov = target.fov * (inScale + (1 - inScale) * easeOut(k));
    }).then(() => {
      this.a = this.b;
      this.b = null;
      this.mix = 0;
      this.#evict();
    });
  }

  /** Swap in a sharper texture of the same room without a visible jump. */
  upgrade(rec) {
    if (!this.a || this.a.rec === rec || this.b) return Promise.resolve();
    this.b = { rec, cam: this.a.cam };   // shared camera: dragging keeps both layers aligned
    return this.#tween('upgrade', reduceMotion() ? 0 : 350, easeOut, (k) => { this.mix = k; }).then(() => {
      if (this.b?.rec !== rec) return;
      this.a = this.b;
      this.b = null;
      this.mix = 0;
      this.#evict();
    });
  }

  /** Screen position (CSS px) of a direction for the visible camera, or null when behind. */
  project(pan, tilt) {
    if (!this.a) return null;
    const { cam } = this.a;
    const m = rotation(cam.pan, cam.tilt);
    const p = pan * DEG, t = tilt * DEG;
    const w = [-Math.sin(p) * Math.cos(t), Math.sin(t), -Math.cos(p) * Math.cos(t)];
    const cx = m[0] * w[0] + m[1] * w[1] + m[2] * w[2];
    const cy = m[3] * w[0] + m[4] * w[1] + m[5] * w[2];
    const cz = m[6] * w[0] + m[7] * w[1] + m[8] * w[2];
    if (cz > -0.02) return null;
    const [tx, ty] = halfTans(cam.fov, this.cssW / this.cssH);
    return { x: ((cx / -cz / tx + 1) / 2) * this.cssW, y: ((1 - cy / -cz / ty) / 2) * this.cssH };
  }

  /** Pixels per radian at the centre of the view (for sizing hotspots). */
  get pixelsPerRadian() {
    if (!this.a) return 1;
    const [tx] = halfTans(this.a.cam.fov, this.cssW / this.cssH);
    return this.cssW / 2 / tx;
  }

  /* ---------- Loop ---------- */
  start() {
    this.running = true;
    this.lastInput = performance.now();
    this.resize();
    this.invalidate();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    clearTimeout(this.idleTimer);
  }

  invalidate() { this.dirty = true; this.#request(); }

  #request() {
    if (!this.raf && this.running) this.raf = requestAnimationFrame(this.tick);
  }

  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.max(1, this.canvas.clientWidth), h = Math.max(1, this.canvas.clientHeight);
    this.cssW = w;
    this.cssH = h;
    const W = Math.round(w * dpr), H = Math.round(h * dpr);
    if (this.canvas.width !== W || this.canvas.height !== H) {
      this.canvas.width = W;
      this.canvas.height = H;
    }
    this.invalidate();
  }

  tick(now) {
    this.raf = 0;
    const dt = Math.min(64, now - (this.lastTime || now)) / 1000;
    this.lastTime = now;
    let active = false;

    for (const tw of this.tweens) {
      const k = tw.duration ? clamp((now - tw.start) / tw.duration, 0, 1) : 1;
      tw.update(tw.ease(k));
      if (k >= 1) { this.tweens.delete(tw); tw.resolve(); } else active = true;
    }

    const cam = this.a?.cam;
    if (cam && !this.pointers.size) {
      if (Math.abs(this.velocity.pan) + Math.abs(this.velocity.tilt) > 0.5) {
        cam.pan += this.velocity.pan * dt;
        cam.tilt += this.velocity.tilt * dt;
        const decay = Math.exp(-dt * 5);
        this.velocity.pan *= decay;
        this.velocity.tilt *= decay;
        active = true;
      } else if (this.interactive && !this.tweens.size && !reduceMotion() && now - this.lastInput > this.autorotate.delay) {
        cam.pan += this.autorotate.speed * dt;
        cam.tilt += (0 - cam.tilt) * Math.min(1, dt * 0.6);   // drift back to the horizon
        active = true;
      }
      cam.tilt = clamp(cam.tilt, -85, 85);
      cam.pan = wrap180(cam.pan);
    }

    if (active || this.dirty) this.render();
    this.dirty = false;
    if (active) this.#request();
  }

  render() {
    if (!this.a?.rec?.tex || this.lost) return;
    const gl = this.gl;
    const { width: W, height: H } = this.canvas;
    const aspect = W / H;
    gl.viewport(0, 0, W, H);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.a.rec.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, (this.b?.rec?.tex) || this.a.rec.tex);
    const bcam = this.b?.cam || this.a.cam;
    gl.uniformMatrix3fv(this.loc.uRotA, false, rotation(this.a.cam.pan, this.a.cam.tilt));
    gl.uniformMatrix3fv(this.loc.uRotB, false, rotation(bcam.pan, bcam.tilt));
    gl.uniform2fv(this.loc.uTanA, halfTans(this.a.cam.fov, aspect));
    gl.uniform2fv(this.loc.uTanB, halfTans(bcam.fov, aspect));
    gl.uniform2f(this.loc.uRes, W, H);
    gl.uniform1f(this.loc.uMix, this.b ? this.mix : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.onFrame?.();
  }

  /** Resolves after the next rendered frame (used to reveal the canvas only once it shows the room). */
  nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => { this.render(); requestAnimationFrame(() => resolve()); }));
  }

  #tween(kind, duration, ease, update) {
    return new Promise((resolve) => {
      if (!duration) { update(1); this.invalidate(); resolve(); return; }
      this.tweens.add({ kind, start: performance.now(), duration, ease, update, resolve });
      this.#request();
    });
  }

  #cancel(kind) {
    for (const tw of this.tweens) if (tw.kind === kind) { this.tweens.delete(tw); tw.resolve(); }
  }

  /* ---------- Input ---------- */
  #touch() {
    this.lastInput = performance.now();
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this.#request(), this.autorotate.delay + 50);
    this.onInteract?.();
  }

  #bindInput() {
    const c = this.canvas;
    let last = null;

    c.addEventListener('pointerdown', (e) => {
      if (!this.interactive || !this.a || this.b) return;
      c.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.velocity = { pan: 0, tilt: 0 };
      this.#cancel('camera');
      last = { t: performance.now() };
      if (this.pointers.size === 2) {
        const [p1, p2] = [...this.pointers.values()];
        this.pinch = { dist: Math.hypot(p1.x - p2.x, p1.y - p2.y), fov: this.a.cam.fov };
      }
      c.classList.add('is-grabbing');
      this.#touch();
    });

    c.addEventListener('pointermove', (e) => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev || !this.a) return;
      const cam = this.a.cam;
      if (this.pointers.size === 1) {
        const [tx, ty] = halfTans(cam.fov, this.cssW / this.cssH);
        const dPan = ((e.clientX - prev.x) * 2 * tx) / this.cssW / DEG;
        const dTilt = ((e.clientY - prev.y) * 2 * ty) / this.cssH / DEG;
        cam.pan += dPan;
        cam.tilt += dTilt;
        const now = performance.now();
        const dt = Math.max(1, now - last.t) / 1000;
        this.velocity = { pan: dPan / dt * 0.6 + this.velocity.pan * 0.4, tilt: dTilt / dt * 0.6 + this.velocity.tilt * 0.4 };
        last.t = now;
      }
      prev.x = e.clientX;
      prev.y = e.clientY;
      if (this.pointers.size === 2 && this.pinch) {
        const [p1, p2] = [...this.pointers.values()];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        cam.fov = clamp(this.pinch.fov * (this.pinch.dist / Math.max(1, dist)), this.minFov, this.maxFov);
      }
      this.#touch();
      this.invalidate();
    });

    const end = (e) => {
      if (!this.pointers.delete(e.pointerId)) return;
      if (this.pointers.size < 2) this.pinch = null;
      if (!this.pointers.size) {
        c.classList.remove('is-grabbing');
        // No fling if the pointer rested before release
        if (performance.now() - (last?.t || 0) > 80 || reduceMotion()) this.velocity = { pan: 0, tilt: 0 };
        this.#touch();
        this.#request();
      }
    };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);

    // Wheel: zoom with Ctrl/⌘ (trackpad pinch sends ctrlKey) or in full screen; otherwise let the page scroll
    c.addEventListener('wheel', (e) => {
      if (!this.interactive || !this.a) return;
      const fullscreen = !!document.fullscreenElement;
      if (!(e.ctrlKey || e.metaKey || fullscreen)) { this.onScrollIntent?.(); return; }
      e.preventDefault();
      this.#cancel('camera');
      this.a.cam.fov = clamp(this.a.cam.fov * Math.exp(e.deltaY * (e.ctrlKey && !e.metaKey ? 0.01 : 0.0015)), this.minFov, this.maxFov);
      this.#touch();
      this.invalidate();
    }, { passive: false });

    c.addEventListener('keydown', (e) => {
      if (!this.interactive || !this.a) return;
      const cam = this.a.cam;
      const step = cam.fov / 8;
      const moves = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
      if (moves[e.key]) {
        e.preventDefault();
        this.turnTo({ pan: cam.pan + moves[e.key][0], tilt: clamp(cam.tilt + moves[e.key][1], -85, 85), fov: cam.fov }, 220);
      } else if (e.key === '+' || e.key === '=') { e.preventDefault(); this.zoomBy(0.8); }
      else if (e.key === '-' || e.key === '_') { e.preventDefault(); this.zoomBy(1.25); }
      else return;
      this.#touch();
    });
  }
}
