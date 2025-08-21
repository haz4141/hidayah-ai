import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/** Enable static HTML export for hosting as plain website */
	output: "export",
	images: {
		/** Allow static export of images without optimization pipeline */
		unoptimized: true,
	},
};

export default nextConfig;
