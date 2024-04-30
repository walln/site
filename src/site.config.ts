import type { SiteConfig } from "@/types";
import type { AstroExpressiveCodeOptions } from "astro-expressive-code";

export const menuLinks: Array<{ title: string; path: string }> = [
	{
		title: "Home",
		path: "/",
	},
	{
		title: "Projects",
		path: "/projects",
	},
	{
		title: "Resume",
		path: "/resume",
	},
];

export const siteConfig: SiteConfig = {
	author: "Nick Wall",
	title: "Nick's Site",
	description: "My personal site",
	lang: "en-GB",
	ogLocale: "en_GB",
	date: {
		locale: "en-GB",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
};

export const expressiveCodeOptions: AstroExpressiveCodeOptions = {
	themes: ["vesper", "github-light"],
	themeCssSelector(theme, { styleVariants }) {
		if (styleVariants.length >= 2) {
			const baseTheme = styleVariants[0]?.theme;
			const altTheme = styleVariants.find(
				(v) => v.theme.type !== baseTheme?.type,
			)?.theme;
			if (theme === baseTheme || theme === altTheme)
				return `[data-theme='${theme.type}']`;
		}
		return `[data-theme="${theme.name}"]`;
	},
	useThemedScrollbars: false,
	styleOverrides: {
		frames: {
			frameBoxShadowCssValue: "none",
		},
		uiLineHeight: "inherit",
		codeFontSize: "0.875rem",
		codeLineHeight: "1.7142857rem",
		borderRadius: "4px",
		codePaddingInline: "1rem",
		codeFontFamily:
			'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;',
	},
};
