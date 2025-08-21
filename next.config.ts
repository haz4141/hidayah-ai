import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		/** Allow static export of images without optimization pipeline */
		unoptimized: true,
	},
};

export default nextConfig;
