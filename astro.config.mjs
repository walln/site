import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import rehypeUnwrapImages from "rehype-unwrap-images";
import { expressiveCodeOptions } from "./src/site.config";
import { remarkReadingTime } from "./src/utils/remark-reading-time";
import { rehypeSidenotes } from "./src/utils/rehype-sidenotes";

// https://astro.build/config
export default defineConfig({
	site: "https://walln.dev",
	// Astro 7 changed the default to 'jsx', which strips whitespace between
	// inline elements and can glue words together in prose. Keep v5/v6 output.
	compressHTML: true,
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		expressiveCode(expressiveCodeOptions),
		icon(),
		react(),
		sitemap(),
		mdx(),
	],
	redirects: {
		"/resume": "/resume.pdf",
	},
	prefetch: true,
	markdown: {
		// Astro 7 defaults to the Sätteri pipeline; opt back into unified so the
		// remark/rehype plugins below keep running.
		processor: unified({
			remarkPlugins: [remarkReadingTime],
			rehypePlugins: [
				rehypeUnwrapImages,
				rehypeSidenotes,
				[
					rehypeExternalLinks,
					{
						target: "_blank",
						rel: ["nofollow, noopener, noreferrer"],
					},
				],
			],
			remarkRehype: {
				footnoteLabelProperties: {
					className: [""],
				},
			},
		}),
	},
	output: "static",
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),
});
