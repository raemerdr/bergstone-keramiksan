"""Build the web assets for the 360° showroom tour from the Insta360 originals.

    python3 tools/build-tour.py

Reads   assets/public/360 Bilder/{n}.jpg  (equirectangular, 7680×3840)
Writes  assets/tour/rooms/node{n}-{2k,4k,6k}.jpg, assets/tour/thumbs/node{n}.jpg,
        assets/img/tour/hero-360*.jpg and the showroom stills.
Projection matches assets/js/pano.js: pan + = turn left, tilt + = up, fov = diagonal.
To add a room: add its arrival view to ENTRY here and its links to ROOMS in assets/js/tour.js.
"""
import os, sys, json, time
import numpy as np
from PIL import Image
from concurrent.futures import ProcessPoolExecutor

ROOT = str(__import__('pathlib').Path(__file__).resolve().parent.parent)
SRC = f'{ROOT}/assets/public/360 Bilder'
OUT = f'{ROOT}/assets/tour'
Image.MAX_IMAGE_PIXELS = None

ENTRY = {  # arrival view per room (from the tour's link targets); node1 = tour start
    'node1': (44.08, -3.72, 100), 'node2': (121.9, 1.1, 100), 'node5': (-128.1, 7.3, 100),
    'node6': (42.9, 2.2, 100), 'node7': (176.5, -0.1, 100), 'node8': (-115.4, 1.6, 100),
    'node4': (61.6, -2.4, 100), 'node9': (-78, 0.1, 100), 'node10': (-31.5, 2.1, 100),
    'node11': (-125.6, 2.4, 100), 'node12': (-119.1, -1.1, 100), 'node13': (-76.6, -3.9, 100),
    'node14': (-173.9, -4.9, 100), 'node15': (-101.9, -2.6, 100), 'node16': (156.9, -2.9, 100),
    'node17': (-98.9, -9.2, 100),
}
HERO = ('node16', 172.0, -2.0, 100.0)


def render(equi, pan, tilt, fov, W, H):
    """Rectilinear view of an equirectangular array (bilinear, horizontally wrapped)."""
    aspect = W / H
    ty = np.tan(np.radians(fov) / 2) / np.hypot(aspect, 1)
    tx = ty * aspect
    xs = ((np.arange(W) + 0.5) / W * 2 - 1) * tx
    ys = (1 - (np.arange(H) + 0.5) / H * 2) * ty
    rx, ry = np.meshgrid(xs, ys)
    rz = -np.ones_like(rx)
    n = np.sqrt(rx * rx + ry * ry + 1)
    rx, ry, rz = rx / n, ry / n, rz / n
    p, t = np.radians(pan), np.radians(tilt)
    cp, sp, ct, st = np.cos(p), np.sin(p), np.cos(t), np.sin(t)
    dx = cp * rx + sp * st * ry + sp * ct * rz          # R = Ry(pan) · Rx(tilt)
    dy = ct * ry - st * rz
    dz = -sp * rx + cp * st * ry + cp * ct * rz
    lon = np.arctan2(dx, -dz)
    lat = np.arcsin(np.clip(dy, -1, 1))
    Hs, Ws = equi.shape[:2]
    u = (0.5 + lon / (2 * np.pi)) * Ws - 0.5
    v = (0.5 - lat / np.pi) * Hs - 0.5
    x0 = np.floor(u).astype(np.int64); y0 = np.floor(v).astype(np.int64)
    fx = (u - x0)[..., None].astype(np.float32); fy = (v - y0)[..., None].astype(np.float32)
    xa, xb = x0 % Ws, (x0 + 1) % Ws
    ya, yb = np.clip(y0, 0, Hs - 1), np.clip(y0 + 1, 0, Hs - 1)
    out = (equi[ya, xa] * (1 - fx) * (1 - fy) + equi[ya, xb] * fx * (1 - fy)
           + equi[yb, xa] * (1 - fx) * fy + equi[yb, xb] * fx * fy)
    return Image.fromarray(np.clip(out + 0.5, 0, 255).astype(np.uint8))


def view(equi, pan, tilt, fov, W, H, ss=2):
    """Supersampled render, downscaled with Lanczos for clean edges."""
    return render(equi, pan, tilt, fov, W * ss, H * ss).resize((W, H), Image.LANCZOS)


def build_room(node):
    n = int(node[4:])
    t0 = time.time()
    src = Image.open(f'{SRC}/{n}.jpg').convert('RGB')
    sizes = {}
    for label, w, q in (('6k', 6144, 80), ('4k', 4096, 80), ('2k', 2048, 76)):
        path = f'{OUT}/rooms/{node}-{label}.jpg'
        src.resize((w, w // 2), Image.LANCZOS).save(path, quality=q, optimize=True)
        sizes[label] = round(os.path.getsize(path) / 1e6, 2)
    # thumbnail at the arrival view (from the 2k — plenty for 320 px)
    equi2k = np.asarray(Image.open(f'{OUT}/rooms/{node}-2k.jpg').convert('RGB'), dtype=np.float32)
    pan, tilt, fov = ENTRY[node]
    view(equi2k, pan, tilt, fov, 320, 200, ss=2).save(f'{OUT}/thumbs/{node}.jpg', quality=80, optimize=True)
    return node, sizes, round(time.time() - t0, 1)


def build_stills():
    """Hero posters + showroom stills straight from the 8K originals."""
    out = {}
    equi = np.asarray(Image.open(f'{SRC}/16.jpg').convert('RGB'), dtype=np.float32)
    _, pan, tilt, fov = HERO
    view(equi, pan, tilt, fov, 2100, 1020, ss=2).save(f'{ROOT}/assets/img/tour/hero-360.jpg', quality=82, optimize=True, progressive=True)
    view(equi, pan, tilt, fov, 780, 1440, ss=2).save(f'{ROOT}/assets/img/tour/hero-360-mobile.jpg', quality=80, optimize=True, progressive=True)
    out['hero'] = 'ok'
    del equi
    equi = np.asarray(Image.open(f'{SRC}/4.jpg').convert('RGB'), dtype=np.float32)
    view(equi, 0, -2, 100, 1260, 1040, ss=2).save(f'{ROOT}/assets/img/tour/showroom-lounge.jpg', quality=80, optimize=True, progressive=True)
    del equi
    equi = np.asarray(Image.open(f'{SRC}/6.jpg').convert('RGB'), dtype=np.float32)
    view(equi, 20, -2, 100, 900, 1350, ss=2).save(f'{ROOT}/assets/img/tour/showroom-hall.jpg', quality=80, optimize=True, progressive=True)
    out['stills'] = 'ok'
    return out


if __name__ == '__main__':
    os.makedirs(f'{OUT}/rooms', exist_ok=True)
    os.makedirs(f'{OUT}/thumbs', exist_ok=True)
    t0 = time.time()
    with ProcessPoolExecutor(max_workers=4) as pool:
        stills = pool.submit(build_stills)
        results = list(pool.map(build_room, ENTRY.keys()))
        print(json.dumps(stills.result()))
    for node, sizes, secs in results:
        print(node, sizes, f'{secs}s')
    total = {k: round(sum(r[1][k] for r in results), 1) for k in ('6k', '4k', '2k')}
    print('totals MB', total, 'elapsed', round(time.time() - t0, 1), 's')
