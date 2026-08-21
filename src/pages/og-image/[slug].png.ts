import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getAllProjects } from "@/data/project";
import { siteConfig } from "@/site.config";
import { getFormattedDate } from "@/utils/date";
import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";

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
	html`<div style="display: flex; flex-direction: column; width: 100%; height: 100%; background-color: #fafafa; color: #171717; font-family: 'Geist Mono'; padding: 64px;">
		<!-- Main content area -->
		<div style="display: flex; flex-direction: column; flex: 1; justify-content: center;">
			<!-- Date -->
			<div style="font-size: 18px; color: #737373; margin-bottom: 24px; letter-spacing: 0.02em;">${pubDate}</div>
			
			<!-- Title -->
			<div style="font-size: 56px; font-weight: 600; line-height: 1.15; color: #171717; letter-spacing: -0.02em;">${title}</div>
		</div>
		
		<!-- Footer -->
		<div style="display: flex; align-items: center; justify-content: space-between; padding-top: 32px; border-top: 1px solid #e5e5e5;">
			<div style="font-size: 20px; font-weight: 600; color: #171717;">${siteConfig.author}</div>
			<div style="font-size: 16px; color: #737373;">${siteConfig.title}</div>
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
	return new Response(new Uint8Array(png), {
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
				params: { slug: project.id },
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
