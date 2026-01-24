const config = {
	// "*": ["cspell --no-must-find-files", "prettier --list-different"],
	"**/!(sst-env.d).{ts,tsx,js,jsx,cjs,mjs}": ["oxlint", "oxfmt --check"],
	"**/*.{md,mdx}": ["markdownlint"],
	"**/*.json": ["oxfmt --check"],
	"**/*.py": ["rye lint", "rye format --check"],
	"**/*.md": ["cspell --no-must-find-files"],
};

export default config;
