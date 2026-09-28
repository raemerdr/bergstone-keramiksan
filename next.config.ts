import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // The catalogue PDFs stay on keramiksan.de. Served through our own origin, so the download
    // attribute on /kataloge saves them instead of opening them (lib/site.ts, CATALOGS).
    return [{ source: "/downloads/:path*", destination: "https://keramiksan.de/wp-content/uploads/:path*" }];
  },
  async redirects() {
    // Keep links to the static draft's pages working
    return [
      { source: "/index.html", destination: "/", permanent: true },
      {
        source: "/:page(fliesen|beratung|planung-aufmass|verlegung-montage|reparaturen).html",
        destination: "/:page",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
