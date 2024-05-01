import getReadingTime from "reading-time";
import { toString as contentToString } from "mdast-util-to-string";

interface Data {
	data: {
		astro: {
			frontmatter: {
				minutesRead: string;
			};
		};
	};
}

export function remarkReadingTime() {
	return (tree: unknown, { data }: Data) => {
		const textOnPage = contentToString(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.minutesRead = readingTime.text;
	};
}
