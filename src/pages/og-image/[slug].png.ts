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
	],
};

const markup = (title: string, pubDate: string) =>
	html`<div tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]">
		<div tw="flex flex-col flex-1 w-full p-10 justify-center">
			<p tw="text-2xl mb-6">${pubDate}</p>
			<h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
		</div>
		<div tw="flex items-center justify-between w-full p-10 border-t border-[#b6a3ff] text-xl">
			<div tw="flex items-center">
				
				<p tw="ml-3 font-semibold">${siteConfig.title}</p>
			</div>
			<p>by ${siteConfig.author}</p>
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
				title: "My Site",
				pubDate: new Date(),
			},
		},
	];

	return projectData;
}
