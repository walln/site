import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
	content: [
		"./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
		"!./src/pages/og-image/[slug].png.ts",
	],
	theme: {
		extend: {
			colors: {
				bg: "hsl(var(--theme-bg) / <alpha-value>)",
				text: "hsl(var(--theme-text) / <alpha-value>)",
				accent: "hsl(var(--theme-accent) / <alpha-value>)",
				"accent-2": "hsl(var(--theme-accent-2) / <alpha-value>)",
				"accent-green": "hsl(var(--theme-accent-green) / <alpha-value>)",
				"accent-yellow": "hsl(var(--theme-accent-yellow) / <alpha-value>)",
				"accent-red": "hsl(var(--theme-accent-red) / <alpha-value>)",
				link: "hsl(var(--theme-link) / <alpha-value>)",
				quote: "hsl(var(--theme-quote) / <alpha-value>)",
			},
			fontFamily: {
				sans: ["Geist Mono", "monospace", ...fontFamily.mono],
				serif: [...fontFamily.serif],
				mono: ["Geist Mono", ...fontFamily.mono],
			},
			tranisitionProperty: { height: "height" },
			// @ts-ignore	Not exposed type -- not even needed once v4 is released
			typography: (theme) => ({
				walln: {
					css: {
						"--tw-prose-body": theme("colors.text / 1"),
						"--tw-prose-headings": theme("colors.accent-2 / 1"),
						"--tw-prose-links": theme("colors.text / 1"),
						"--tw-prose-bold": theme("colors.text / 1"),
						"--tw-prose-bullets": theme("colors.text / 1"),
						"--tw-prose-quotes": theme("colors.quote / 1"),
						"--tw-prose-code": theme("colors.text / 1"),
						"--tw-prose-hr": "0.5px dashed #666",
						"--tw-prose-th-borders": "#666",
					},
				},
				sm: {
					css: {
						code: {
							fontSize: theme("fontSize.sm")[0],
							fontWeight: "400",
						},
					},
				},
				DEFAULT: {
					css: {
						a: {
							"@apply walln-link": "",
						},
						strong: {
							fontWeight: "700",
						},
						code: {
							border: "1px dotted #666",
							borderRadius: "2px",
						},
						blockquote: {
							borderLeftWidth: "0",
						},
						hr: {
							borderTopStyle: "dashed",
						},
						thead: {
							borderBottomWidth: "none",
						},
						"thead th": {
							fontWeight: "700",
							borderBottom: "1px dashed #666",
						},
						"tbody tr": {
							borderBottomWidth: "none",
						},
						tfoot: {
							borderTop: "1px dashed #666",
						},
						sup: {
							"@apply ms-0.5": "",
							a: {
								"@apply bg-none": "",
								"&:hover": {
									"@apply text-link no-underline bg-none": "",
								},
								"&:before": {
									content: "'['",
								},
								"&:after": {
									content: "']'",
								},
							},
						},
					},
				},
			}),
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/aspect-ratio"),
		plugin(({ addComponents }) => {
			addComponents({
				".walln-link": {
					"@apply underline underline-offset-2": {},
					"&:hover": {
						"@apply decoration-link decoration-2": {},
					},
				},
				".title": {
					"@apply text-2xl font-semibold text-accent-2": {},
				},
			});
		}),
	],
} satisfies Config;
