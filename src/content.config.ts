import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
	if (!array.length) return array;
	const lowercaseItems = array.map((str) => str.toLowerCase());
	const distinctItems = new Set(lowercaseItems);
	return Array.from(distinctItems);
}

const projectsCollection = defineCollection({
	loader: glob({
		pattern: ["**/*.md", "**/*.mdx"],
		base: "./src/content/project",
	}),
	schema: ({ image }) =>
		z.object({
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			abstract: z.string().optional(),
			description: z.string().min(50).max(160),
			draft: z.boolean().default(false),
			graphic: z.enum(["voice-lanes"]).optional(),
			ogImage: z.string().optional(),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			title: z.string().max(60),
			updatedDate: z
				.string()
				.or(z.date())
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
		}),
});

export const collections = { project: projectsCollection };
