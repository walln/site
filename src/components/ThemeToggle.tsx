import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
	if (typeof window === "undefined") return "light";

	const stored = localStorage.getItem("theme") as Theme | null;
	if (stored === "light" || stored === "dark") return stored;

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export default function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setTheme(getInitialTheme());
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme, mounted]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	// Prevent hydration mismatch by not rendering until mounted
	if (!mounted) {
		return (
			<button
				type="button"
				className="p-2 text-text-secondary hover:text-text hover:bg-bg-secondary transition-colors"
				aria-label="Toggle theme"
			>
				<span className="w-5 h-5 block" />
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="p-2 text-text-secondary hover:text-text hover:bg-bg-secondary transition-colors"
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
		>
			{theme === "light" ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="w-5 h-5"
					aria-hidden="true"
				>
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
				</svg>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="w-5 h-5"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="5" />
					<line x1="12" y1="1" x2="12" y2="3" />
					<line x1="12" y1="21" x2="12" y2="23" />
					<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
					<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
					<line x1="1" y1="12" x2="3" y2="12" />
					<line x1="21" y1="12" x2="23" y2="12" />
					<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
					<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
				</svg>
			)}
		</button>
	);
}
