import { type CollectionEntry, getCollection } from "astro:content";

export async function getAllPosts() {
	return await getCollection("blog", ({ data }) => {
		return (
			data.archived !== true &&
			(import.meta.env.PROD ? data.draft !== true : true)
		);
	});
}

export function sortPostsByDate(posts: Array<CollectionEntry<"blog">>) {
	return posts.sort((a, b) => {
		const aDate = new Date(a.data.updatedDate ?? a.data.publishDate).valueOf();
		const bDate = new Date(b.data.updatedDate ?? b.data.publishDate).valueOf();
		return bDate - aDate;
	});
}
