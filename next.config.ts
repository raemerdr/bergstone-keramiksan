import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
