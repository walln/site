import { useEffect, useRef, useState } from "react";

interface ASCIITextureProps {
	opacity?: number;
	className?: string;
}

// Full alphanumeric + symbols for dense grid
const GRID_CHARS =
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,./<>?";

const HIDDEN_WORDS = [
	"REASONING",
	"PLANNING",
	"THINKING",
	"ORCHESTRATING",
	"DELEGATING",
	"CHAINING",
	"STREAMING",
	"TRANSCRIBING",
	"SYNTHESIZING",
	"LISTENING",
	"INFERRING",
	"EMBEDDING",
	"TOKENIZING",
	"PROMPTING",
	"ATTENDING",
	"TRAINING",
	"ITERATING",
	"DEPLOYING",
	"SCALING",
	"EXECUTING",
	"COMPILING",
	"ANALYZING",
	"TRACING",
	"FETCHING",
	"PARSING",
	"INDEXING",
	"QUERYING",
	"CONNECTING",
];

interface SearchSnake {
	x: number;
	y: number;
	dirX: number;
	dirY: number;
	path: Array<{ x: number; y: number; char: string }>;
	maxLength: number;
	id: number;
	state: "searching" | "locking" | "scanning";
	targetWordId: number; // -1 if none
}

interface HiddenWord {
	id: number;
	text: string;
	x: number;
	y: number;
	charsRevealed: number; // integer count of chars revealed
	state: "hidden" | "targeted" | "scanning" | "fading";
	opacity: number;
}

export default function ASCIITexture({
	opacity = 0.15,
	className = "",
}: ASCIITextureProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>(0);
	const snakesRef = useRef<SearchSnake[]>([]);
	const hiddenWordsRef = useRef<HiddenWord[]>([]);
	const nextWordId = useRef<number>(0);

	// Grid state: [charIndex, opacity, type]
	const gridRef = useRef<Float32Array>(new Float32Array(0));
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		setPrefersReducedMotion(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) =>
			setPrefersReducedMotion(e.matches);
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let width = window.innerWidth;
		let height = window.innerHeight;
		const fontSize = 14;
		let cols = 0;
		let rows = 0;
		let nextSnakeId = 0;

		const resize = () => {
			width = window.innerWidth;
			height = window.innerHeight;

			const dpr = window.devicePixelRatio || 1;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;

			ctx.scale(dpr, dpr);

			cols = Math.ceil(width / fontSize);
			rows = Math.ceil(height / fontSize);

			// Initialize grid with random characters
			gridRef.current = new Float32Array(cols * rows * 3);
			for (let i = 0; i < cols * rows; i++) {
				gridRef.current[i * 3] = Math.floor(Math.random() * GRID_CHARS.length); // charIndex
				gridRef.current[i * 3 + 1] = 0.3 + Math.random() * 0.2; // Base opacity
				gridRef.current[i * 3 + 2] = 0; // type
			}

			initHiddenWords();
			initSnakes();
		};

		const initHiddenWords = () => {
			hiddenWordsRef.current = [];
			const numWords = Math.floor((width * height) / 20000);
			for (let i = 0; i < numWords; i++) {
				spawnHiddenWord();
			}
		};

		const spawnHiddenWord = () => {
			const text =
				HIDDEN_WORDS[Math.floor(Math.random() * HIDDEN_WORDS.length)];
			// Keep words away from edges
			const x = Math.floor(Math.random() * (cols - text.length - 4)) + 2;
			const y = Math.floor(Math.random() * (rows - 4)) + 2;

			// Collision check
			const hasCollision = hiddenWordsRef.current.some((word) => {
				if (Math.abs(word.y - y) < 2) {
					const range1Start = word.x - 2;
					const range1End = word.x + word.text.length + 2;
					const range2Start = x;
					const range2End = x + text.length;
					return range1Start < range2End && range1End > range2Start;
				}
				return false;
			});

			if (!hasCollision) {
				hiddenWordsRef.current.push({
					id: nextWordId.current++,
					text,
					x,
					y,
					charsRevealed: 0,
					state: "hidden",
					opacity: 1,
				});
			}
		};

		const initSnakes = () => {
			snakesRef.current = [];
			const numSnakes = Math.max(3, Math.floor(width / 200));
			for (let i = 0; i < numSnakes; i++) {
				spawnSnake();
			}
		};

		const spawnSnake = () => {
			const x = Math.floor(Math.random() * cols);
			const y = Math.floor(Math.random() * rows);
			snakesRef.current.push({
				x,
				y,
				dirX: Math.random() > 0.5 ? 1 : -1,
				dirY: 0,
				path: [],
				maxLength: Math.floor(Math.random() * 30) + 15,
				id: nextSnakeId++,
				state: "searching",
				targetWordId: -1,
			});
		};

		resize();
		window.addEventListener("resize", resize);

		let frame = 0;

		const draw = () => {
			frame++;

			const computedStyle = getComputedStyle(document.documentElement);
			const textColorRaw = computedStyle
				.getPropertyValue("--color-text")
				.trim();
			const parts = textColorRaw.split(/\s+/).filter(Boolean);
			const h = parts[0] ? Number.parseFloat(parts[0]) : 0;
			const s = parts[1] ? Number.parseFloat(parts[1]) : 0;
			const l = parts[2] ? Number.parseFloat(parts[2]) : 50;
			const baseColor = `hsl(${h} ${s}% ${l}%)`;

			ctx.clearRect(0, 0, width, height);
			ctx.font = `${fontSize}px "Geist Mono", monospace`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			// 1. Update Logic (~20 updates/sec for slower, more deliberate animation)
			if (frame % 3 === 0) {
				// Manage snakes
				if (snakesRef.current.length < Math.max(3, Math.floor(width / 200))) {
					if (Math.random() > 0.95) spawnSnake();
				}

				snakesRef.current = snakesRef.current.filter((snake) => {
					// Store current position with a random character for the trail
					const trailChar =
						GRID_CHARS[Math.floor(Math.random() * GRID_CHARS.length)];
					snake.path.push({ x: snake.x, y: snake.y, char: trailChar });
					if (snake.path.length > snake.maxLength) snake.path.shift();

					// State Machine
					if (snake.state === "searching") {
						// Random movement
						if (Math.random() > 0.8) {
							if (snake.dirX !== 0) {
								snake.dirX = 0;
								snake.dirY = Math.random() > 0.5 ? 1 : -1;
							} else {
								snake.dirX = Math.random() > 0.5 ? 1 : -1;
								snake.dirY = 0;
							}
						}

						// Look for targets
						let bestDist = 15;
						let bestWordId = -1;

						for (const word of hiddenWordsRef.current) {
							if (word.state === "hidden") {
								const dx = word.x - snake.x;
								const dy = word.y - snake.y;
								const dist = Math.abs(dx) + Math.abs(dy);
								if (dist < bestDist) {
									bestDist = dist;
									bestWordId = word.id;
								}
							}
						}

						if (bestWordId !== -1) {
							snake.state = "locking";
							snake.targetWordId = bestWordId;
							const word = hiddenWordsRef.current.find(
								(w) => w.id === bestWordId,
							);
							if (word) word.state = "targeted";
						}
					} else if (snake.state === "locking") {
						const word = hiddenWordsRef.current.find(
							(w) => w.id === snake.targetWordId,
						);
						if (!word || word.state !== "targeted") {
							snake.state = "searching";
							snake.targetWordId = -1;
						} else {
							const dx = word.x - snake.x;
							const dy = word.y - snake.y;

							if (dx === 0 && dy === 0) {
								snake.state = "scanning";
								snake.dirX = 1; // Start moving immediately
								snake.dirY = 0;
								word.state = "scanning";
								word.charsRevealed = 1; // Reveal first char immediately
							} else {
								if (Math.abs(dx) > Math.abs(dy)) {
									snake.dirX = dx > 0 ? 1 : -1;
									snake.dirY = 0;
								} else {
									snake.dirX = 0;
									snake.dirY = dy > 0 ? 1 : -1;
								}
							}
						}
					} else if (snake.state === "scanning") {
						const word = hiddenWordsRef.current.find(
							(w) => w.id === snake.targetWordId,
						);
						snake.dirX = 1;
						snake.dirY = 0;

						if (!word) {
							snake.state = "searching";
							snake.targetWordId = -1;
						}
						// Word reveal happens after movement below
					}

					// Move
					snake.x += snake.dirX;
					snake.y += snake.dirY;

					// Reveal word characters at current snake position (after move)
					if (snake.state === "scanning" && snake.targetWordId !== -1) {
						const word = hiddenWordsRef.current.find(
							(w) => w.id === snake.targetWordId,
						);
						if (word) {
							// Snake position relative to word start
							const progress = snake.x - word.x;

							// Reveal character at current snake position
							if (progress >= 0 && progress < word.text.length) {
								word.charsRevealed = Math.max(word.charsRevealed, progress + 1);
							}

							// Snake has passed the end of the word
							if (snake.x > word.x + word.text.length - 1) {
								// Ensure all characters are revealed
								word.charsRevealed = word.text.length;
								snake.state = "searching";
								snake.targetWordId = -1;
								word.state = "fading";
							}
						}
					}

					// Bounds check
					if (
						snake.x < 0 ||
						snake.x >= cols ||
						snake.y < 0 ||
						snake.y >= rows
					) {
						// Handle word abandonment if snake dies
						if (snake.state === "scanning" && snake.targetWordId !== -1) {
							const word = hiddenWordsRef.current.find(
								(w) => w.id === snake.targetWordId,
							);
							if (word) word.state = "fading"; // Fade out partially revealed word
						}
						return false;
					}

					// Update trails
					const idx = (snake.y * cols + snake.x) * 3;
					if (idx >= 0 && idx < gridRef.current.length) {
						gridRef.current[idx + 1] = 0.8;
						gridRef.current[idx + 2] = 1;
					}

					return true;
				});

				// Update words lifecycle
				hiddenWordsRef.current = hiddenWordsRef.current.filter((word) => {
					if (word.state === "fading") {
						word.opacity -= 0.02;
						if (word.opacity <= 0) return false;
					}
					return true;
				});

				// Refill words
				if (
					hiddenWordsRef.current.length < Math.floor((width * height) / 20000)
				) {
					spawnHiddenWord();
				}
			}

			// 2. Render Grid
			const grid = gridRef.current;
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const idx = (r * cols + c) * 3;
					let opacityValue = grid[idx + 1];
					const type = grid[idx + 2];
					const charIndex = grid[idx];

					if (type === 1) {
						// active trail
						opacityValue *= 0.92;
						if (opacityValue < 0.35) {
							opacityValue = 0.3 + Math.random() * 0.2;
							grid[idx + 2] = 0;
						}
						grid[idx + 1] = opacityValue;
					} else {
						// background
						if (Math.random() > 0.995) {
							grid[idx] = Math.floor(Math.random() * GRID_CHARS.length);
						}
					}

					const x = c * fontSize + fontSize / 2;
					const y = r * fontSize + fontSize / 2;
					const charToDraw = GRID_CHARS[charIndex];

					ctx.fillStyle = baseColor;
					ctx.globalAlpha = opacityValue * opacity;
					ctx.fillText(charToDraw, x, y);
				}
			}

			// 3. Render Snake Trails (fading ASCII characters)
			ctx.fillStyle = baseColor;
			for (const snake of snakesRef.current) {
				const pathLen = snake.path.length;
				for (let i = 0; i < pathLen; i++) {
					const pos = snake.path[i];
					// Calculate fade: oldest (i=0) is dimmest, newest is brightest
					const fadeProgress = i / pathLen;
					const trailOpacity = opacity * (0.3 + fadeProgress * 0.5);

					const x = pos.x * fontSize + fontSize / 2;
					const y = pos.y * fontSize + fontSize / 2;
					ctx.globalAlpha = trailOpacity;
					ctx.fillText(pos.char, x, y);
				}
			}

			// 4. Render Snake Heads (skip when scanning within word bounds - let character reveal be the visual)
			for (const snake of snakesRef.current) {
				// Don't render snake head when it's scanning within a word - the reveal is the visual
				let skipRender = false;
				if (snake.state === "scanning" && snake.targetWordId !== -1) {
					const word = hiddenWordsRef.current.find(
						(w) => w.id === snake.targetWordId,
					);
					if (
						word &&
						snake.x >= word.x &&
						snake.x < word.x + word.text.length
					) {
						skipRender = true;
					}
				}

				if (!skipRender) {
					const x = snake.x * fontSize + fontSize / 2;
					const y = snake.y * fontSize + fontSize / 2;
					ctx.globalAlpha = opacity * 0.8;
					ctx.fillText("█", x, y);
				}
			}

			// 5. Render Words (on top of snake heads so revealed chars are visible)
			for (const word of hiddenWordsRef.current) {
				if (word.charsRevealed === 0) continue;

				const xStart = word.x * fontSize;
				const yStart = word.y * fontSize;

				ctx.textAlign = "left";
				ctx.textBaseline = "middle";
				ctx.font = `bold ${fontSize}px "Geist Mono", monospace`;

				const currentText = word.text.substring(0, word.charsRevealed);

				// Clear grid behind revealed text (but not the snake head area)
				const textWidth = ctx.measureText(currentText).width;
				ctx.clearRect(xStart, yStart, textWidth, fontSize);

				ctx.fillStyle = baseColor;
				ctx.globalAlpha = word.opacity * opacity * 0.9;

				// Adjust y position to match grid baseline
				ctx.fillText(currentText, xStart, yStart + fontSize / 2);

				// Reset
				ctx.textAlign = "center";
				ctx.font = `${fontSize}px "Geist Mono", monospace`;
			}

			if (!prefersReducedMotion) {
				animationRef.current = requestAnimationFrame(draw);
			}
		};

		if (prefersReducedMotion) {
			ctx.clearRect(0, 0, width, height);
			ctx.font = `${fontSize}px "Geist Mono", monospace`;
			ctx.textAlign = "center";
			const computedStyle = getComputedStyle(document.documentElement);
			const textColorRaw = computedStyle
				.getPropertyValue("--color-text")
				.trim();
			const parts = textColorRaw.split(/\s+/).filter(Boolean);
			const h = parts[0] ? Number.parseFloat(parts[0]) : 0;
			const s = parts[1] ? Number.parseFloat(parts[1]) : 0;
			const l = parts[2] ? Number.parseFloat(parts[2]) : 50;
			ctx.fillStyle = `hsl(${h} ${s}% ${l}%)`;

			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const char =
						GRID_CHARS[Math.floor(Math.random() * GRID_CHARS.length)];
					const x = c * fontSize + fontSize / 2;
					const y = r * fontSize + fontSize / 2;
					ctx.globalAlpha = 0.3 * opacity;
					ctx.fillText(char, x, y);
				}
			}
		} else {
			animationRef.current = requestAnimationFrame(draw);
		}

		return () => {
			window.removeEventListener("resize", resize);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [prefersReducedMotion, opacity]);

	return (
		<canvas
			ref={canvasRef}
			className={`fixed inset-0 pointer-events-none ${className}`}
			style={{ zIndex: 0 }}
			tabIndex={-1}
		/>
	);
}
