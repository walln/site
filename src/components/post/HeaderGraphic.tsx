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

const X0 = 70;
const PX_PER_S = 70;
const GEN_PX_PER_S = 224;

const CALLER_START = 0.4;
const CALLER_END = 1.7;
const GEN_START = 1.85;
const SPEECH_START = 2.1;
const WORK_START = 1.9;
const RESULT_AT = 4.3;
const SNAP_END = 4.55;
const LOOP_SECONDS = 10.2;
const STATIC_FRAME = 5.4;

const GEN_ORIGIN = X0 + GEN_START * PX_PER_S;
const PLANNED_END = GEN_ORIGIN + 320;
const SPEECH_ORIGIN = GEN_ORIGIN;
const BUFFER_PX = 28;
const RESULT_X = X0 + RESULT_AT * PX_PER_S;
const SPLICE_X =
	SPEECH_ORIGIN + (RESULT_AT - SPEECH_START) * PX_PER_S + BUFFER_PX;
const FINAL_END = SPLICE_X + 320;

function callerWidth(t: number): number {
	const from = Math.max(0, Math.min(t, CALLER_END) - CALLER_START);
	return from * PX_PER_S;
}

function genFront(t: number): number {
	if (t < GEN_START) return GEN_ORIGIN;
	if (t < RESULT_AT) {
		return Math.min(PLANNED_END, GEN_ORIGIN + (t - GEN_START) * GEN_PX_PER_S);
	}
	if (t < SNAP_END) {
		const ratio = (t - RESULT_AT) / (SNAP_END - RESULT_AT);
		return PLANNED_END - (PLANNED_END - SPLICE_X) * ratio;
	}
	return Math.min(FINAL_END, SPLICE_X + (t - SNAP_END) * GEN_PX_PER_S);
}

function speechFront(t: number): number {
	if (t < SPEECH_START) return SPEECH_ORIGIN;
	return Math.min(FINAL_END, SPEECH_ORIGIN + (t - SPEECH_START) * PX_PER_S);
}

function workWidth(t: number): number {
	const from = Math.max(0, Math.min(t, RESULT_AT) - WORK_START);
	return from * PX_PER_S;
}

function SpliceLoopGraphic() {
	const [t, setT] = useState(STATIC_FRAME);

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

	const spliced = t >= RESULT_AT;
	const dropFade = spliced ? Math.max(0, 1 - (t - RESULT_AT) / 0.6) : 0;

	return (
		<div className="post-graphic-stage" aria-hidden="true">
			<svg viewBox="0 0 800 240" className="h-full w-full" role="presentation">
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
				{Array.from({ length: 17 }, (_, i) => (
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
					x={X0 + CALLER_START * PX_PER_S}
					y={52}
					width={callerWidth(t)}
					height={18}
					rx={3}
					fill="hsl(214 68% 64%)"
					opacity={0.85}
				/>

				{/* generation running ahead of the audio */}
				<rect
					x={GEN_ORIGIN}
					y={108}
					width={Math.max(0, genFront(t) - GEN_ORIGIN)}
					height={6}
					rx={2}
					fill="currentColor"
					opacity={0.28}
				/>
				{/* the truncated tail, fading out after the splice */}
				{dropFade > 0 && (
					<rect
						x={SPLICE_X}
						y={108}
						width={PLANNED_END - SPLICE_X}
						height={6}
						rx={2}
						fill="currentColor"
						opacity={0.14 * dropFade}
					/>
				)}
				{/* spoken audio: never stalls */}
				<rect
					x={SPEECH_ORIGIN}
					y={120}
					width={Math.max(0, speechFront(t) - SPEECH_ORIGIN)}
					height={16}
					rx={3}
					fill="hsl(214 68% 64%)"
					opacity={0.85}
				/>

				{/* tool work */}
				<rect
					x={X0 + WORK_START * PX_PER_S}
					y={176}
					width={workWidth(t)}
					height={14}
					rx={3}
					fill="url(#hg-hatch)"
				/>

				{/* result lands, splice happens */}
				{spliced && (
					<g stroke="hsl(15 72% 52%)" opacity={0.9}>
						<line
							x1={RESULT_X}
							x2={RESULT_X}
							y1={100}
							y2={195}
							strokeDasharray="3 4"
							strokeWidth={1.2}
						/>
						<line
							x1={SPLICE_X}
							x2={SPLICE_X}
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
