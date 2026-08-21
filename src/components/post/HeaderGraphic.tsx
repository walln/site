import { useEffect, useState } from "react";

/** The set of header graphics a post page can request via frontmatter. */
export type PostGraphic = "voice-lanes";

interface HeaderGraphicProps {
	kind: PostGraphic;
}

/** Renders the header graphic named in a post's frontmatter. */
export default function HeaderGraphic({ kind }: HeaderGraphicProps) {
	switch (kind) {
		case "voice-lanes":
			return <SpliceLoopGraphic />;
		default: {
			const _exhaustive: never = kind;
			return _exhaustive;
		}
	}
}

// One looping scene, drawn in seconds and scaled to px. A caller speaks, the
// agent starts answering while a tool runs, and when the result lands the
// unspoken tail of the generation is truncated and steered — the spoken bar
// never stalls. This is the same grammar as the article's figures:
// blue = audio the caller hears, gray = machinery, warm = the splice moment.

const CALLER_START = 0.4;
const CALLER_END = 1.7;
const GEN_START = 1.85;
const SPEECH_START = 2.1;
const WORK_START = 1.9;
const RESULT_AT = 4.3;
const SNAP_END = 4.55;
const LOOP_SECONDS = 10.2;
const STATIC_FRAME = 5.4;

/** Horizontal scale for one rendering of the scene, in viewBox units. */
interface SceneScale {
	viewWidth: number;
	x0: number;
	pxPerS: number;
	genPxPerS: number;
	bufferPx: number;
	tailPx: number;
	gridLines: number;
}

interface SceneGeometry extends SceneScale {
	genOrigin: number;
	plannedEnd: number;
	speechOrigin: number;
	resultX: number;
	spliceX: number;
	finalEnd: number;
}

function geometryFor(scale: SceneScale): SceneGeometry {
	const genOrigin = scale.x0 + GEN_START * scale.pxPerS;
	const spliceX =
		genOrigin + (RESULT_AT - SPEECH_START) * scale.pxPerS + scale.bufferPx;
	return {
		...scale,
		genOrigin,
		plannedEnd: genOrigin + scale.tailPx,
		speechOrigin: genOrigin,
		resultX: scale.x0 + RESULT_AT * scale.pxPerS,
		spliceX,
		finalEnd: spliceX + scale.tailPx,
	};
}

const WIDE = geometryFor({
	viewWidth: 800,
	x0: 70,
	pxPerS: 70,
	genPxPerS: 224,
	bufferPx: 28,
	tailPx: 320,
	gridLines: 17,
});

// Phone widths shrink the SVG to under half size, which makes the wide scene's
// text unreadable. The compact scene keeps the same timing but compresses the
// horizontal run into a narrower viewBox, so everything renders larger.
const COMPACT = geometryFor({
	viewWidth: 480,
	x0: 52,
	pxPerS: 42,
	genPxPerS: 134,
	bufferPx: 17,
	tailPx: 192,
	gridLines: 10,
});

// Must match the artifact/mobile breakpoint in global.css, where
// .post-graphic swaps to the compact aspect ratio.
const COMPACT_QUERY = "(max-width: 39.99rem)";

function callerWidth(g: SceneGeometry, t: number): number {
	const from = Math.max(0, Math.min(t, CALLER_END) - CALLER_START);
	return from * g.pxPerS;
}

function genFront(g: SceneGeometry, t: number): number {
	if (t < GEN_START) return g.genOrigin;
	if (t < RESULT_AT) {
		return Math.min(g.plannedEnd, g.genOrigin + (t - GEN_START) * g.genPxPerS);
	}
	if (t < SNAP_END) {
		const ratio = (t - RESULT_AT) / (SNAP_END - RESULT_AT);
		return g.plannedEnd - (g.plannedEnd - g.spliceX) * ratio;
	}
	return Math.min(g.finalEnd, g.spliceX + (t - SNAP_END) * g.genPxPerS);
}

function speechFront(g: SceneGeometry, t: number): number {
	if (t < SPEECH_START) return g.speechOrigin;
	return Math.min(g.finalEnd, g.speechOrigin + (t - SPEECH_START) * g.pxPerS);
}

function workWidth(g: SceneGeometry, t: number): number {
	const from = Math.max(0, Math.min(t, RESULT_AT) - WORK_START);
	return from * g.pxPerS;
}

function SpliceLoopGraphic() {
	const [t, setT] = useState(STATIC_FRAME);
	const [compact, setCompact] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(COMPACT_QUERY);
		const update = () => setCompact(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, []);

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let frame = 0;
		const startedAt = performance.now();
		const step = (now: number) => {
			setT(((now - startedAt) / 1000) % LOOP_SECONDS);
			frame = requestAnimationFrame(step);
		};
		frame = requestAnimationFrame(step);
		return () => cancelAnimationFrame(frame);
	}, []);

	const g = compact ? COMPACT : WIDE;
	const spliced = t >= RESULT_AT;
	const dropFade = spliced ? Math.max(0, 1 - (t - RESULT_AT) / 0.6) : 0;

	return (
		<div className="post-graphic-stage" aria-hidden="true">
			<svg
				viewBox={`0 0 ${g.viewWidth} 240`}
				className="h-full w-full"
				role="presentation"
			>
				<defs>
					<pattern
						id="hg-hatch"
						patternUnits="userSpaceOnUse"
						width="6"
						height="6"
						patternTransform="rotate(-45)"
					>
						<line
							x1="0"
							y1="0"
							x2="0"
							y2="6"
							stroke="currentColor"
							strokeOpacity="0.32"
							strokeWidth="1.5"
						/>
					</pattern>
				</defs>
				{Array.from({ length: g.gridLines }, (_, i) => (
					<line
						key={i}
						x1={40 + i * 45}
						x2={40 + i * 45}
						y1="28"
						y2="212"
						stroke="currentColor"
						strokeOpacity="0.07"
					/>
				))}
				<g
					fontSize="11"
					fontFamily="SF Mono, ui-monospace, monospace"
					letterSpacing="0.12em"
					fill="currentColor"
					opacity="0.5"
				>
					<text x="12" y="66">
						caller
					</text>
					<text x="12" y="130">
						agent
					</text>
					<text x="12" y="188">
						work
					</text>
				</g>

				{/* caller speech */}
				<rect
					x={g.x0 + CALLER_START * g.pxPerS}
					y={52}
					width={callerWidth(g, t)}
					height={18}
					rx={3}
					fill="hsl(214 68% 64%)"
					opacity={0.85}
				/>

				{/* generation running ahead of the audio */}
				<rect
					x={g.genOrigin}
					y={108}
					width={Math.max(0, genFront(g, t) - g.genOrigin)}
					height={6}
					rx={2}
					fill="currentColor"
					opacity={0.28}
				/>
				{/* the truncated tail, fading out after the splice */}
				{dropFade > 0 && (
					<rect
						x={g.spliceX}
						y={108}
						width={g.plannedEnd - g.spliceX}
						height={6}
						rx={2}
						fill="currentColor"
						opacity={0.14 * dropFade}
					/>
				)}
				{/* spoken audio: never stalls */}
				<rect
					x={g.speechOrigin}
					y={120}
					width={Math.max(0, speechFront(g, t) - g.speechOrigin)}
					height={16}
					rx={3}
					fill="hsl(214 68% 64%)"
					opacity={0.85}
				/>

				{/* tool work */}
				<rect
					x={g.x0 + WORK_START * g.pxPerS}
					y={176}
					width={workWidth(g, t)}
					height={14}
					rx={3}
					fill="url(#hg-hatch)"
				/>

				{/* result lands, splice happens */}
				{spliced && (
					<g stroke="hsl(15 72% 52%)" opacity={0.9}>
						<line
							x1={g.resultX}
							x2={g.resultX}
							y1={100}
							y2={195}
							strokeDasharray="3 4"
							strokeWidth={1.2}
						/>
						<line
							x1={g.spliceX}
							x2={g.spliceX}
							y1={104}
							y2={140}
							strokeWidth={1.6}
						/>
					</g>
				)}
			</svg>
		</div>
	);
}
