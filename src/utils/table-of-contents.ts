// Heavy inspiration from starlight: https://github.com/withastro/starlight/blob/main/packages/starlight/utils/generateToC.ts
import type { MarkdownHeading } from "astro";

export interface TableOfContentsItem extends MarkdownHeading {
	children: TableOfContentsItem[];
}

interface TableOfContentsOptions {
	maxHeadingLevel?: number | undefined;
	minHeadingLevel?: number | undefined;
}

function injectChild(
	items: TableOfContentsItem[],
	item: TableOfContentsItem,
): void {
	const lastItem = items.at(-1);
	if (!lastItem || lastItem.depth >= item.depth) {
		items.push(item);
	} else {
		injectChild(lastItem.children, item);
		return;
	}
}

export function generateTableOfContents(
	headings: ReadonlyArray<MarkdownHeading>,
	{ maxHeadingLevel = 4, minHeadingLevel = 2 }: TableOfContentsOptions = {},
) {
	const bodyHeadings = headings.filter(
		({ depth }) => depth >= minHeadingLevel && depth <= maxHeadingLevel,
	);
	const toc: Array<TableOfContentsItem> = [];

	for (const heading of bodyHeadings)
		injectChild(toc, { ...heading, children: [] });

	return toc;
}
