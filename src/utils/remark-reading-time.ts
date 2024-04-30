import getReadingTime from "reading-time";
import { toString as contentToString } from "mdast-util-to-string";

export function remarkReadingTime() {
	return (tree: unknown, { data }: any) => {
		const textOnPage = contentToString(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.minutesRead = readingTime.text;
	};
}
