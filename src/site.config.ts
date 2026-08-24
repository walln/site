import type { SiteConfig } from "@/types";
import type { AstroExpressiveCodeOptions } from "astro-expressive-code";

// `blurb` is shown only in the mobile navigation index, where there is room
// for a line of description under each entry.
export const menuLinks: Array<{ title: string; path: string; blurb: string }> = [
	{
		title: "Home",
		path: "/",
		blurb: "the short version",
	},
	{
		title: "Blog",
		path: "/blog",
		blurb: "notes and essays, mostly ml",
	},
	{
		title: "Resume",
		path: "/resume",
		blurb: "the long version",
	},
];

export const siteConfig: SiteConfig = {
	author: "Nick Wall",
	title: "Nick Wall",
	description:
		"Personal site of Nick Wall — leading research & engineering @ Maple.",
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
	themes: ["github-light"],
	useThemedScrollbars: false,
	styleOverrides: {
		frames: {
			frameBoxShadowCssValue: "none",
		},
		uiLineHeight: "inherit",
		codeFontSize: "0.875rem",
		codeLineHeight: "1.7142857rem",
		borderRadius: "0",
		codePaddingInline: "1rem",
		codeFontFamily:
			'"SF Mono", "SFMono-Regular", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;',
	},
};
