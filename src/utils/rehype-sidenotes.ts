type HastProperties = Record<string, unknown>;

interface HastNode {
	type: string;
	tagName?: string;
	properties?: HastProperties;
	children?: HastNode[];
	value?: string;
}

function classList(properties: HastProperties | undefined): string[] {
	const className = properties?.className;
	if (Array.isArray(className)) {
		return className.map(String);
	}
	if (typeof className === "string") {
		return className.split(/\s+/);
	}
	return [];
}

function hasFlag(
	properties: HastProperties | undefined,
	name: string,
): boolean {
	if (!properties) return false;
	const camel = name.replace(/-([a-z])/g, (_, letter: string) =>
		letter.toUpperCase(),
	);
	return properties[name] != null || properties[camel] != null;
}

function isElement(node: HastNode | undefined, tagName: string): boolean {
	return node?.type === "element" && node.tagName === tagName;
}

function isFootnotesSection(node: HastNode): boolean {
	if (!isElement(node, "section")) return false;
	return (
		hasFlag(node.properties, "data-footnotes") ||
		classList(node.properties).includes("footnotes")
	);
}

function isFootnoteRef(node: HastNode): boolean {
	if (!isElement(node, "a")) return false;
	return hasFlag(node.properties, "data-footnote-ref");
}

function hrefOf(node: HastNode): string {
	return String(node.properties?.href ?? "");
}

function footnoteIdFromHref(href: string): string | undefined {
	if (!href.startsWith("#")) return undefined;
	return href.slice(1);
}

function textOf(node: HastNode): string {
	if (node.type === "text") return node.value ?? "";
	return (node.children ?? []).map(textOf).join("");
}

function flattenInline(nodes: HastNode[]): HastNode[] {
	const result: HastNode[] = [];
	for (const node of nodes) {
		if (isElement(node, "p")) {
			result.push(...flattenInline(node.children ?? []));
			continue;
		}
		if (
			isElement(node, "a") &&
			hasFlag(node.properties, "data-footnote-backref")
		) {
			continue;
		}
		if (node.children) {
			result.push({ ...node, children: flattenInline(node.children) });
			continue;
		}
		result.push(node);
	}
	return result;
}

function collectFootnotes(tree: HastNode): Map<string, HastNode[]> {
	const notes = new Map<string, HastNode[]>();

	function walk(node: HastNode): void {
		if (isFootnotesSection(node)) {
			const items = (node.children ?? []).flatMap((child) => {
				if (isElement(child, "ol") || isElement(child, "ul")) {
					return child.children ?? [];
				}
				return [];
			});
			for (const item of items) {
				if (!isElement(item, "li")) continue;
				const id = String(item.properties?.id ?? "");
				if (!id) continue;
				notes.set(id, flattenInline(item.children ?? []));
			}
			return;
		}
		for (const child of node.children ?? []) walk(child);
	}

	walk(tree);
	return notes;
}

function sidenoteNodes(
	index: string,
	checkboxId: string,
	content: HastNode[],
): HastNode {
	return {
		type: "element",
		tagName: "span",
		properties: { className: ["sidenote-wrap"] },
		children: [
			{
				type: "element",
				tagName: "label",
				properties: {
					className: ["sidenote-ref"],
					for: checkboxId,
				},
				children: [{ type: "text", value: index }],
			},
			{
				type: "element",
				tagName: "input",
				properties: {
					type: "checkbox",
					id: checkboxId,
					className: ["sidenote-check"],
				},
				children: [],
			},
			{
				type: "element",
				tagName: "small",
				properties: { className: ["sidenote"] },
				children: [
					{
						type: "element",
						tagName: "span",
						properties: { className: ["sidenote-index"] },
						children: [{ type: "text", value: index }],
					},
					{ type: "text", value: " " },
					...content,
				],
			},
		],
	};
}

function replaceRefs(tree: HastNode, notes: Map<string, HastNode[]>): void {
	function replaceIn(parent: HastNode): void {
		const children = parent.children;
		if (!children) return;

		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (!child) continue;

			const ref = isElement(child, "sup")
				? child.children?.find(isFootnoteRef)
				: isFootnoteRef(child)
					? child
					: undefined;

			if (ref) {
				const id = footnoteIdFromHref(hrefOf(ref));
				const content = id ? notes.get(id) : undefined;
				if (content) {
					const index = textOf(ref).trim() || String(i + 1);
					children[i] = sidenoteNodes(index, `sidenote-${id}`, content);
					continue;
				}
			}

			replaceIn(child);
		}
	}

	replaceIn(tree);
}

function removeFootnotesSection(tree: HastNode): void {
	if (!tree.children) return;
	tree.children = tree.children.filter((child) => {
		if (isFootnotesSection(child)) return false;
		removeFootnotesSection(child);
		return true;
	});
}

export function rehypeSidenotes() {
	return (tree: HastNode) => {
		const notes = collectFootnotes(tree);
		if (notes.size === 0) return;
		replaceRefs(tree, notes);
		removeFootnotesSection(tree);
	};
}
