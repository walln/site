export function isDarkTheme() {
	return document.documentElement.getAttribute("data-theme") === "dark";
}

export function toggleClass(element: HTMLElement, className: string) {
	element.classList.toggle(className);
}
