import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
	content: [
		"./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
		"!./src/pages/og-image/[slug].png.ts",
	],
	darkMode: ["selector", '[data-theme="dark"]'],
	theme: {
		extend: {
			colors: {
				// New design system colors
				bg: "hsl(var(--color-bg) / <alpha-value>)",
				"bg-secondary": "hsl(var(--color-bg-secondary) / <alpha-value>)",
				text: "hsl(var(--color-text) / <alpha-value>)",
				"text-secondary": "hsl(var(--color-text-secondary) / <alpha-value>)",
				border: "hsl(var(--color-border) / <alpha-value>)",
				accent: "hsl(var(--color-accent) / <alpha-value>)",
				link: "hsl(var(--color-accent) / <alpha-value>)",
				// Legacy colors (for migration period)
				"accent-2": "hsl(var(--color-text) / <alpha-value>)",
				"accent-green": "hsl(var(--color-accent) / <alpha-value>)",
				"accent-yellow": "hsl(60 100% 50% / <alpha-value>)",
				"accent-red": "hsl(0 100% 50% / <alpha-value>)",
				quote: "hsl(var(--color-text-secondary) / <alpha-value>)",
			},
			fontFamily: {
				sans: ["Geist Mono", ...fontFamily.mono],
				serif: [...fontFamily.serif],
				mono: ["Geist Mono", ...fontFamily.mono],
			},
			transitionProperty: {
				height: "height",
				colors:
					"color, background-color, border-color, text-decoration-color, fill, stroke",
			},
			transitionDuration: {
				DEFAULT: "200ms",
			},
			// @ts-ignore	Not exposed type -- not even needed once v4 is released
			typography: (theme) => ({
				walln: {
					css: {
						"--tw-prose-body": theme("colors.text / 1"),
						"--tw-prose-headings": theme("colors.text / 1"),
						"--tw-prose-links": theme("colors.text / 1"),
						"--tw-prose-bold": theme("colors.text / 1"),
						"--tw-prose-bullets": theme("colors.text / 1"),
						"--tw-prose-quotes": theme("colors.text-secondary / 1"),
						"--tw-prose-code": theme("colors.text / 1"),
						"--tw-prose-hr": theme("colors.border / 1"),
						"--tw-prose-th-borders": theme("colors.border / 1"),
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
							border: "1px solid hsl(var(--color-border))",
							padding: "0.125rem 0.25rem",
						},
						blockquote: {
							borderLeftWidth: "2px",
							borderLeftColor: "hsl(var(--color-border))",
						},
						hr: {
							borderTopStyle: "solid",
							borderColor: "hsl(var(--color-border))",
						},
						thead: {
							borderBottomWidth: "none",
						},
						"thead th": {
							fontWeight: "600",
							borderBottom: "1px solid hsl(var(--color-border))",
						},
						"tbody tr": {
							borderBottomWidth: "none",
						},
						tfoot: {
							borderTop: "1px solid hsl(var(--color-border))",
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
					"@apply underline underline-offset-4 decoration-border transition-colors":
						{},
					"&:hover": {
						"@apply decoration-accent": {},
					},
				},
				".title": {
					"@apply text-2xl font-semibold text-text": {},
				},
			});
		}),
	],
} satisfies Config;
