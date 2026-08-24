import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

type SpanKind = "speech" | "work" | "fill" | "wait" | "gen";
type LaneRole = "human" | "model" | "work";

/** A single bar on a timeline lane, in chart time units. */
export interface TimelineSpan {
	start: number;
	end: number;
	label?: string;
	/**
	 * Compact fallback text tried when `label` fits neither inside the bar
	 * nor in the empty track beside it. Without one, the label hides instead
	 * (the bar itself still shows; the caption carries the meaning).
	 */
	shortLabel?: string;
	kind: SpanKind;
	/**
	 * Which side of the bar the label prefers when it doesn't fit inside:
	 * "start" (default) tries the empty track after the bar first, "end"
	 * tries the empty track before it first.
	 */
	labelAlign?: "start" | "end";
}

/** One horizontal track of spans, labeled at the left edge. */
export interface TimelineLane {
	label: string;
	role: LaneRole;
	total?: string;
	spans: TimelineSpan[];
}

/** A titled cluster of lanes rendered together. */
export interface TimelineGroup {
	title?: string;
	lanes: TimelineLane[];
}

/** A vertical dashed annotation at a fixed chart time. */
export interface TimelineMarker {
	at: number;
	label: string;
}

interface TimelineChartProps {
	duration: number;
	ticks: number[];
	tickSuffix?: string;
	groups: TimelineGroup[];
	markers?: TimelineMarker[];
	/**
	 * Wall-clock seconds for one full playhead sweep. When set, the chart
	 * animates on scroll-into-view: spans reveal as the playhead passes.
	 * Omit for a static chart. Reduced-motion users always get the static
	 * render.
	 */
	playSeconds?: number;
	/** Show an elapsed-seconds readout while playing (chart units = seconds). */
	showClock?: boolean;
}

type PlaybackMode = "static" | "armed" | "playing" | "scrubbing" | "done";

/*
 * Camera-follow: on screens too narrow to fit every label, the time axis
 * expands while playing and pans so the playhead stays in frame (old
 * content slides out to the left). The expanded width is sized to the
 * text: wide enough that labels fit inside their own bars, within limits.
 * When playback settles, the camera zooms back out to the fitted view.
 */

/** Floor for the expanded time axis: roughly the desktop track width. */
const CAMERA_MIN_TRACK_PX = 560;
/** Ceiling for the expanded time axis, keeping the pan traversable. */
const CAMERA_MAX_TRACK_PX = 900;
/** Where the playhead rests within the visible frame while panning. */
const CAMERA_ANCHOR = 0.62;
/** Duration of the fitted <-> expanded zoom tween. */
const CAMERA_TWEEN_MS = 450;
/** Matches the stylesheet's phone breakpoint for lane charts. */
const CAMERA_QUERY = "(max-width: 39.99rem)";

/*
 * Label placement: a label may only render where it fully fits, so text
 * never straddles a bar edge or another label. Each candidate text (label,
 * then shortLabel) tries inside the bar, then the empty track on its
 * preferred side, then the other side; if nothing fits the label hides.
 */

/** Grace so a label a hair wider than its bar still counts as inside. */
const INSIDE_TOLERANCE_PX = 2;
/** Breathing room an outside label keeps from its bar and from neighbors. */
const CHIP_GAP_PX = 4;
/** Rough per-character width used until the real text has been measured. */
const ESTIMATE_PER_CHAR_PX = 6.6;
/** Estimated horizontal padding baked into a rendered label. */
const ESTIMATE_PADDING_PX = 10;

type LabelPlacement = "inside" | "after" | "before";

interface PlacedLabel {
	text: string;
	placement: LabelPlacement;
	widthPx: number;
}

/**
 * Decide where every label in a lane goes, left to right. Outside labels
 * reserve the track pixels they occupy so later labels can't overlap them;
 * earlier spans win contested gaps.
 */
function placeLaneLabels(
	lane: TimelineLane,
	duration: number,
	trackPx: number,
	widthOf: (text: string) => number,
): (PlacedLabel | null)[] {
	const px = (units: number) => (units / duration) * trackPx;
	const reserved: [number, number][] = [];
	const free = (x0: number, x1: number) =>
		reserved.every(([a, b]) => x1 <= a || b <= x0);
	return lane.spans.map((span, index) => {
		if (!span.label) return null;
		const startPx = px(span.start);
		const endPx = px(span.end);
		const prevEndPx = px(lane.spans[index - 1]?.end ?? 0);
		const nextStartPx = px(lane.spans[index + 1]?.start ?? duration);
		const candidates = span.shortLabel
			? [span.label, span.shortLabel]
			: [span.label];
		const sides: LabelPlacement[] =
			span.labelAlign === "end" ? ["before", "after"] : ["after", "before"];
		for (const text of candidates) {
			const widthPx = widthOf(text);
			if (widthPx <= endPx - startPx + INSIDE_TOLERANCE_PX) {
				return { text, placement: "inside", widthPx };
			}
			for (const side of sides) {
				const outsidePx = widthPx + CHIP_GAP_PX;
				const [x0, x1] =
					side === "before"
						? [startPx - outsidePx, startPx]
						: [endPx, endPx + outsidePx];
				const fits = side === "before" ? x0 >= prevEndPx : x1 <= nextStartPx;
				if (fits && free(x0, x1)) {
					reserved.push([x0, x1]);
					return { text, placement: side, widthPx };
				}
			}
		}
		return null;
	});
}

function lastEnd(lane: TimelineLane): number {
	return lane.spans.reduce((max, span) => Math.max(max, span.end), 0);
}

/**
 * A lane/Gantt chart of speech, generation, and tool work over time.
 *
 * With `playSeconds` set, it renders empty tracks until scrolled into view,
 * then sweeps a playhead across the chart in real time, revealing spans as
 * they "happen". Readers can scrub the timeline, skip to the end, or replay.
 *
 * On narrow screens a camera follows the sweep (see CAMERA_* above) so every
 * label gets full-size room while it is the current moment.
 */
export function TimelineChart({
	duration,
	ticks,
	tickSuffix = "s",
	groups,
	markers,
	playSeconds,
	showClock = false,
}: TimelineChartProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const tRef = useRef(duration);
	const [mode, setMode] = useState<PlaybackMode>("static");
	const [t, setT] = useState(duration);
	const animated = playSeconds != null && playSeconds > 0;

	const frameRef = useRef<HTMLDivElement>(null);
	const zoomRef = useRef(0);
	const [narrow, setNarrow] = useState(false);
	const [frameWidth, setFrameWidth] = useState(0);
	/** Camera engagement, 0 = fitted full chart, 1 = expanded and panning. */
	const [zoom, setZoom] = useState(0);

	const measureRef = useRef<HTMLDivElement>(null);
	/** Measured pixel widths of rendered label texts, keyed by the text. */
	const [labelWidths, setLabelWidths] = useState<Record<string, number>>({});

	const labelTexts = useMemo(() => {
		const texts = new Set<string>();
		for (const group of groups) {
			for (const lane of group.lanes) {
				for (const span of lane.spans) {
					if (span.label) texts.add(span.label);
					if (span.shortLabel) texts.add(span.shortLabel);
				}
			}
		}
		return [...texts];
	}, [groups]);

	const seek = (next: number, nextMode: PlaybackMode) => {
		tRef.current = next;
		setT(next);
		setMode(nextMode);
	};

	// Arm the animation after hydration unless the user prefers reduced motion,
	// then start the sweep once the chart is actually in view.
	useEffect(() => {
		if (!animated) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		tRef.current = 0;
		setT(0);
		setMode("armed");
		const root = rootRef.current;
		if (!root) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setMode((current) => (current === "armed" ? "playing" : current));
					observer.disconnect();
				}
			},
			{ threshold: 0.35 },
		);
		observer.observe(root);
		return () => observer.disconnect();
	}, [animated]);

	useEffect(() => {
		if (mode !== "playing" || playSeconds == null) return;
		const rate = duration / playSeconds;
		const startT = tRef.current;
		const startedAt = performance.now();
		let frame = requestAnimationFrame(function step(now: number) {
			const next = startT + ((now - startedAt) / 1000) * rate;
			if (next >= duration) {
				tRef.current = duration;
				setT(duration);
				setMode("done");
				return;
			}
			tRef.current = next;
			setT(next);
			frame = requestAnimationFrame(step);
		});
		return () => cancelAnimationFrame(frame);
	}, [mode, duration, playSeconds]);

	useEffect(() => {
		if (!animated) return;
		const query = window.matchMedia(CAMERA_QUERY);
		const update = () => setNarrow(query.matches);
		update();
		query.addEventListener("change", update);
		return () => query.removeEventListener("change", update);
	}, [animated]);

	useEffect(() => {
		const frame = frameRef.current;
		if (!frame) return;
		const observer = new ResizeObserver((entries) => {
			const width = entries[0]?.contentRect.width;
			if (width != null) setFrameWidth(width);
		});
		observer.observe(frame);
		return () => observer.disconnect();
	}, []);

	// Measure hidden twins of every label text. Observing them (rather than
	// measuring once) keeps widths honest across webfont swap-in and the
	// phone-breakpoint font-size change.
	useEffect(() => {
		const measurer = measureRef.current;
		if (!measurer) return;
		const observer = new ResizeObserver(() => {
			const widths: Record<string, number> = {};
			for (const node of measurer.children) {
				const text = (node as HTMLElement).dataset.text;
				if (text) widths[text] = node.getBoundingClientRect().width;
			}
			setLabelWidths(widths);
		});
		for (const node of measurer.children) observer.observe(node);
		return () => observer.disconnect();
	}, [labelTexts]);

	const widthOf = (text: string) =>
		labelWidths[text] ??
		text.length * ESTIMATE_PER_CHAR_PX + ESTIMATE_PADDING_PX;

	// The width the camera expands to: enough for every label to sit inside
	// its own bar, clamped so the pan stays traversable. Labels whose bars
	// are too brief even at the ceiling fall to chip placement beside them.
	const expandedTarget = useMemo(() => {
		let required = CAMERA_MIN_TRACK_PX;
		for (const group of groups) {
			for (const lane of group.lanes) {
				for (const span of lane.spans) {
					if (!span.label || span.end <= span.start) continue;
					const labelPx =
						labelWidths[span.label] ??
						span.label.length * ESTIMATE_PER_CHAR_PX + ESTIMATE_PADDING_PX;
					const fraction = (span.end - span.start) / duration;
					required = Math.max(required, labelPx / fraction);
				}
			}
		}
		return Math.min(CAMERA_MAX_TRACK_PX, required);
	}, [groups, duration, labelWidths]);

	const cameraEligible =
		animated && narrow && frameWidth > 0 && frameWidth < expandedTarget;
	const cameraTarget =
		cameraEligible && (mode === "playing" || mode === "scrubbing") ? 1 : 0;

	useEffect(() => {
		if (zoomRef.current === cameraTarget) return;
		const from = zoomRef.current;
		const startedAt = performance.now();
		let frame = requestAnimationFrame(function step(now: number) {
			const progress = Math.min(1, (now - startedAt) / CAMERA_TWEEN_MS);
			const eased = progress * progress * (3 - 2 * progress);
			const next = from + (cameraTarget - from) * eased;
			zoomRef.current = next;
			setZoom(next);
			if (progress < 1) frame = requestAnimationFrame(step);
		});
		return () => cancelAnimationFrame(frame);
	}, [cameraTarget]);

	const pct = (value: number) => `${(value / duration) * 100}%`;
	const shownT = mode === "static" ? duration : t;
	const sweeping = mode === "playing" || mode === "scrubbing";

	// The panned width interpolates between fitted and expanded; the pan keeps
	// the playhead anchored in frame and degrades to 0 as the camera fits.
	const expandedWidth = Math.max(frameWidth, expandedTarget);
	const contentWidth = frameWidth + zoom * (expandedWidth - frameWidth);
	const playFraction = duration > 0 ? shownT / duration : 0;
	const maxPan = Math.max(0, contentWidth - frameWidth);
	const pan = Math.min(
		maxPan,
		Math.max(0, playFraction * contentWidth - CAMERA_ANCHOR * frameWidth),
	);
	const cameraStyle =
		zoom > 0
			? ({
					"--cam-w": `${contentWidth}px`,
					"--cam-x": `${-pan}px`,
				} as CSSProperties)
			: undefined;
	const cameraState =
		cameraTarget === 1 ? "on" : zoom > 0 ? "closing" : undefined;

	// Pixel width the time axis currently occupies; 0 until first measure
	// (and during SSR), which selects the placement-free legacy rendering.
	const trackPx = contentWidth;

	const timeFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const ratio = (event.clientX - rect.left) / rect.width;
		return Math.min(duration, Math.max(0, ratio * duration));
	};

	const onScrubDown = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (mode === "static" || mode === "armed") return;
		event.currentTarget.setPointerCapture(event.pointerId);
		seek(timeFromPointer(event), "scrubbing");
	};

	const onScrubMove = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (mode !== "scrubbing") return;
		seek(timeFromPointer(event), "scrubbing");
	};

	const onScrubUp = () => {
		if (mode !== "scrubbing") return;
		const next = tRef.current;
		setMode(next >= duration - duration / 1000 ? "done" : "playing");
	};

	return (
		<div
			className="lane-chart"
			data-camera={cameraState}
			ref={rootRef}
			style={cameraStyle}
		>
			<div className="lane-measure" aria-hidden="true" ref={measureRef}>
				{labelTexts.map((text) => (
					<span className="lane-span-label" data-text={text} key={text}>
						{text}
					</span>
				))}
			</div>
			<div className="lane-axis">
				<div className="lane-axis-label">time</div>
				<div className="lane-viewport">
					<div className="lane-axis-ticks lane-cam">
						{ticks.map((tick) => (
							<span
								className="lane-axis-tick"
								key={tick}
								style={{ left: pct(tick) }}
							>
								{tick}
								{tickSuffix}
							</span>
						))}
					</div>
				</div>
			</div>
			<div className="lane-body">
				{groups.map((group) => (
					<div
						className="lane-group"
						key={group.title ?? group.lanes[0]?.label}
					>
						{group.title && (
							<div className="lane-group-title">{group.title}</div>
						)}
						{group.lanes.map((lane) => {
							const laneDone = shownT >= lastEnd(lane);
							const placements =
								trackPx > 0
									? placeLaneLabels(lane, duration, trackPx, widthOf)
									: null;
							return (
								<div
									className="lane-row"
									data-role={lane.role}
									key={`${group.title ?? ""}-${lane.label}`}
								>
									<div className="lane-label">
										{lane.label}
										{lane.total && (
											<span
												className="lane-total"
												data-shown={laneDone.toString()}
											>
												{lane.total}
											</span>
										)}
									</div>
									<div className="lane-viewport">
										<div className="lane-track lane-cam">
											{lane.spans.map((span) => {
												const revealedEnd = Math.min(span.end, shownT);
												if (revealedEnd <= span.start) return null;
												return (
													<div
														className={`lane-span lane-span-${span.kind}`}
														key={`${span.start}-${span.end}-${span.label ?? span.kind}`}
														style={{
															left: pct(span.start),
															width: pct(revealedEnd - span.start),
														}}
													/>
												);
											})}
											{/* Labels render above the bars, and only where they
											    fully fit — inside the bar or in empty track beside
											    it — so text never straddles a bar edge. */}
											{lane.spans.map((span, index) => {
												if (!span.label) return null;
												if (!placements) {
													// Pre-measure/SSR: the original inside-anchored
													// rendering, corrected after first measure.
													if (shownT <= span.start) return null;
													const anchored =
														span.labelAlign === "end"
															? { right: pct(duration - span.end) }
															: { left: pct(span.start) };
													return (
														<span
															className={`lane-span-label lane-span-label-${span.kind}`}
															data-align={span.labelAlign ?? "start"}
															key={`label-${span.start}-${span.label}`}
															style={anchored}
														>
															{span.label}
														</span>
													);
												}
												const placed = placements[index];
												if (!placed) return null;
												const toPx = (units: number) =>
													(units / duration) * trackPx;
												// Inside labels wait until enough of the bar has been
												// revealed to hold them; outside labels land once the
												// bar reaches their side of the track.
												const shown =
													placed.placement === "inside"
														? toPx(Math.min(shownT, span.end) - span.start) >=
															Math.min(
																placed.widthPx,
																toPx(span.end - span.start),
															) -
																0.5
														: placed.placement === "after"
															? shownT >= span.end
															: shownT > span.start;
												if (!shown) return null;
												const anchored =
													placed.placement === "before"
														? { right: pct(duration - span.start) }
														: {
																left: pct(
																	placed.placement === "after"
																		? span.end
																		: span.start,
																),
															};
												return (
													<span
														className={`lane-span-label lane-span-label-${span.kind}`}
														data-align={
															placed.placement === "before" ? "end" : "start"
														}
														data-placement={placed.placement}
														key={`label-${span.start}-${span.label}`}
														style={anchored}
													>
														{placed.text}
													</span>
												);
											})}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				))}
				<div className="lane-overlay" aria-hidden="true" ref={frameRef}>
					<div className="lane-cam lane-cam-fill">
						<div className="lane-time-grid">
							{ticks.map((tick) => (
								<span
									className="lane-time-line"
									key={tick}
									style={{ left: pct(tick) }}
								/>
							))}
						</div>
						{sweeping && (
							<div className="lane-playhead" style={{ left: pct(shownT) }} />
						)}
					</div>
				</div>
				{animated && mode !== "static" && mode !== "armed" && (
					<div
						className="lane-scrub"
						aria-hidden="true"
						onPointerDown={onScrubDown}
						onPointerMove={onScrubMove}
						onPointerUp={onScrubUp}
						onPointerCancel={onScrubUp}
					/>
				)}
			</div>
			{markers && markers.length > 0 && (
				<div className="lane-markers">
					<div className="lane-cam lane-cam-fill">
						{markers.map((marker) =>
							shownT >= marker.at ? (
								<div
									className="lane-marker"
									key={`${marker.at}-${marker.label}`}
									style={{ left: pct(marker.at) }}
								>
									<span className="lane-marker-line" />
									<span className="lane-marker-label">{marker.label}</span>
								</div>
							) : null,
						)}
					</div>
				</div>
			)}
			{animated && mode !== "static" && (
				<div className="lane-controls">
					{showClock && (
						<span className="lane-clock">
							{shownT.toFixed(1)}
							{tickSuffix}
						</span>
					)}
					{mode === "armed" && (
						<button
							type="button"
							className="artifact-control"
							onClick={() => seek(0, "playing")}
						>
							play
						</button>
					)}
					{sweeping && (
						<button
							type="button"
							className="artifact-control"
							onClick={() => seek(duration, "done")}
						>
							skip
						</button>
					)}
					{mode === "done" && (
						<button
							type="button"
							className="artifact-control"
							onClick={() => seek(0, "playing")}
						>
							replay
						</button>
					)}
				</div>
			)}
		</div>
	);
}
