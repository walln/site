import pw from "/Users/nickwall/.bun/install/global/node_modules/playwright/index.js";

const { chromium } = pw;

const BASE = "http://localhost:4323";
const OUT = "/tmp/menu-check";
const errors = [];

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({
	viewport: { width: 390, height: 844 },
	deviceScaleFactor: 2,
	isMobile: true,
	hasTouch: true,
});

page.on("console", (m) => {
	if (m.type() === "error") errors.push(`console: ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

const shot = async (name) => {
	const path = `${OUT}/${name}.png`;
	await page.screenshot({ path });
	return path;
};

const box = (sel) =>
	page.evaluate((s) => {
		const el = document.querySelector(s);
		if (!el) return null;
		const r = el.getBoundingClientRect();
		return { top: +r.top.toFixed(1), left: +r.left.toFixed(1), bottom: +r.bottom.toFixed(1) };
	}, sel);

const report = {};

// --- closed state, home ---
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
report.toggleText = (await page.textContent("#toggle-navigation-menu"))?.trim();
report.closedHeaderBox = await box("#main-header nav > div > a");
report.closedToggleBox = await box("#toggle-navigation-menu");
report.shots = { closed: await shot("01-closed") };

// --- open state ---
await page.click("#toggle-navigation-menu");
await page.waitForTimeout(800);
report.shots.open = await shot("02-open");

report.openWordmarkBox = await box(".menu-topline a");
report.openCloseBox = await box(".menu-topline button");
report.realHeaderOpacity = await page.evaluate(
	() => getComputedStyle(document.getElementById("main-header")).opacity,
);
report.htmlOverflow = await page.evaluate(
	() => getComputedStyle(document.documentElement).overflow,
);
report.entries = await page.evaluate(() =>
	Array.from(document.querySelectorAll(".menu-link")).map((a) => {
		const r = a.getBoundingClientRect();
		return {
			index: a.querySelector(".menu-item-index")?.textContent,
			title: a.querySelector(".menu-item-title")?.textContent,
			blurb: a.querySelector(".menu-item-blurb")?.textContent,
			current: a.getAttribute("aria-current"),
			indexColor: getComputedStyle(a.querySelector(".menu-item-index")).color,
			bottom: +r.bottom.toFixed(1),
		};
	}),
);
report.footLabel = (await page.textContent(".menu-foot-label"))?.trim();
report.footBottom = (await box(".menu-foot"))?.bottom;
report.socialCount = await page.locator(".menu-foot-socials a").count();
report.indexScrolls = await page.evaluate(() => {
	const el = document.querySelector(".menu-index");
	return { scrollH: el.scrollHeight, clientH: el.clientHeight };
});
report.scrimBg = await page.evaluate(() => {
	const s = getComputedStyle(document.querySelector(".menu-scrim"));
	return { background: s.backgroundColor, filter: s.backdropFilter, opacity: s.opacity };
});

// --- close via button ---
await page.click("#close-navigation-menu");
await page.waitForTimeout(600);
report.closedAfterButton = await page.evaluate(() => ({
	open: document.getElementById("mobile-navigation-menu").classList.contains("open"),
	htmlOverflow: document.documentElement.style.overflow,
	headerOpacity: getComputedStyle(document.getElementById("main-header")).opacity,
	expanded: document.getElementById("toggle-navigation-menu").getAttribute("aria-expanded"),
}));
report.shots.reclosed = await shot("03-reclosed");

// --- escape key ---
await page.click("#toggle-navigation-menu");
await page.waitForTimeout(400);
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
report.escapeClosed = await page.evaluate(
	() => !document.getElementById("mobile-navigation-menu").classList.contains("open"),
);

// --- scroll still works after close ---
await page.evaluate(() => window.scrollTo(0, 500));
await page.waitForTimeout(200);
report.scrollAfterClose = await page.evaluate(() => window.scrollY);

// --- open while scrolled ---
await page.click("#toggle-navigation-menu");
await page.waitForTimeout(800);
report.scrolledOpen = {
	topline: await box(".menu-topline"),
	firstEntry: await box(".menu-link"),
};
report.shots.scrolledOpen = await shot("04-open-scrolled");
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

// --- blog page: active entry should be 02 ---
await page.goto(`${BASE}/blog`, { waitUntil: "networkidle" });
await page.click("#toggle-navigation-menu");
await page.waitForTimeout(800);
report.blogActive = await page.evaluate(() =>
	Array.from(document.querySelectorAll(".menu-link")).map((a) => ({
		title: a.querySelector(".menu-item-title")?.textContent,
		current: a.getAttribute("aria-current"),
		ruleOpacity: getComputedStyle(a, "::before").opacity,
	})),
);
report.shots.blogOpen = await shot("05-open-blog");

// --- wide layout (a blog post uses layout-wide) ---
const firstPost = await page.getAttribute("main a[href^='/blog/']", "href");
if (firstPost) {
	await page.goto(`${BASE}${firstPost}`, { waitUntil: "networkidle" });
	report.wide = {
		url: firstPost,
		isWide: await page.evaluate(() => document.body.classList.contains("layout-wide")),
		headerBottom: (await box("#main-header"))?.bottom,
		wordmarkLeft: (await box("#main-header nav > div > a"))?.left,
	};
	await page.click("#toggle-navigation-menu");
	await page.waitForTimeout(800);
	report.wide.openWordmark = await box(".menu-topline a");
	report.shots.wideOpen = await shot("06-open-wide-post");
}

// --- navigating from an open menu must not leave scroll locked ---
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.click("#toggle-navigation-menu");
await page.waitForTimeout(400);
await page.click(".menu-list .menu-link:nth-child(1), .menu-item:nth-child(2) .menu-link");
await page.waitForTimeout(1200);
report.afterNavigation = await page.evaluate(() => ({
	url: location.pathname,
	htmlOverflow: document.documentElement.style.overflow,
	bodyHasMenuOpen: document.body.classList.contains("menu-open"),
	sheetOpen: document.getElementById("mobile-navigation-menu")?.classList.contains("open"),
}));
await page.evaluate(() => window.scrollTo(0, 300));
await page.waitForTimeout(200);
report.scrollAfterNavigation = await page.evaluate(() => window.scrollY);

report.errors = errors;
console.log(JSON.stringify(report, null, 2));
await browser.close();
