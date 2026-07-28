import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/frames/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Declared after the wildcard above so it wins for this exact path — Next.js
        // applies matching header rules in order and later matches take precedence
        // for the same header key. manifest.json changes whenever the extraction
        // pipeline is re-run (frame count, section boundaries, even which fields
        // exist — as happened when the intro sequence was added), so it must always
        // be revalidated, unlike the frame images, or browsers that cached it under
        // the immutable rule keep serving a stale shape indefinitely and crash
        // components that read fields the old manifest didn't have.
        source: "/frames/manifest.json",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
    ];
  },
};

export default nextConfig;
