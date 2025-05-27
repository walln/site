import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { siteConfig } from "@/site.config";
import { getFormattedDate } from "@/utils/date";
import { getAllProjects } from "@/data/project";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadFontBuffer(fontPath: string): ArrayBuffer {
	// Resolve the font path to an absolute path
	const absolutePath = resolve(fontPath);
	// Read the file synchronously
	const fontBuffer = readFileSync(absolutePath);
	// Convert Buffer to ArrayBuffer
	const arrayBuffer = new Uint8Array(fontBuffer).buffer;
	return arrayBuffer;
}

const ogOptions: SatoriOptions = {
	width: 1200,
	height: 630,
	fonts: [
		{
			name: "Geist Mono",
			data: Buffer.from(
				loadFontBuffer(
					"./node_modules/@fontsource/geist-mono/files/geist-mono-latin-300-normal.woff",
				),
			),
			weight: 300,
			style: "normal",
		},
		{
			name: "Geist Mono",
			data: Buffer.from(
				loadFontBuffer(
					"./node_modules/@fontsource/geist-mono/files/geist-mono-latin-600-normal.woff",
				),
			),
			weight: 600,
			style: "normal",
		},
	],
};

const markup = (title: string, pubDate: string) =>
	html`<div style="display: flex; flex-direction: column; width: 100%; height: 100%; background-color: black; color: white; font-family: 'Geist Mono'; padding: 48px; border: 4px dashed #888888;">
		<!-- Header with date -->
		<div style="display: flex; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px dashed #888888;">
			<span style="font-size: 24px; margin-right: 16px; color: #39ff14;">$</span>
			<span style="font-size: 20px; text-transform: uppercase; letter-spacing: 0.1em; color: #888888;">${pubDate}</span>
		</div>
		
		<!-- Main title -->
		<div style="font-size: 52px; font-weight: 600; line-height: 1.1; color: white; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 40px; flex: 1; display: flex; align-items: center;">${title}</div>
		
		<!-- Footer -->
		<div style="display: flex; align-items: center; justify-content: space-between; border-top: 2px dashed #39ff14; padding-top: 24px;">
			<div style="display: flex; align-items: center;">
				<span style="font-size: 20px; margin-right: 16px; color: #39ff14;">$</span>
				<span style="font-size: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: white;">${siteConfig.title}</span>
			</div>
			<span style="font-size: 18px; color: #888888;">by ${siteConfig.author}</span>
		</div>
	</div>`;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
	const { title, pubDate } = context.props as Props;

	const projectDate = getFormattedDate(pubDate, {
		weekday: "long",
		month: "long",
	});

	// @ts-expect-error Mismatch in types due to dep versions. (can fix later)
	const svg = await satori(markup(title, projectDate), ogOptions);
	const png = new Resvg(svg).render().asPng();
	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}

export async function getStaticPaths() {
	const projects = await getAllProjects();
	const projectData: {
		params: { slug: string };
		props: { title: string; pubDate: Date };
	}[] = [
		...projects
			.filter(({ data }) => !data.ogImage)
			.map((project) => ({
				params: { slug: project.slug },
				props: {
					title: project.data.title,
					pubDate: project.data.updatedDate ?? project.data.publishDate,
				},
			})),
		{
			params: { slug: "social-card" },
			props: {
				title: "Hello World",
				pubDate: new Date(),
			},
		},
	];

	return projectData;
}
