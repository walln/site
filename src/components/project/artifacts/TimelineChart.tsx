import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type SpanKind = "speech" | "work" | "fill" | "wait" | "gen";
type LaneRole = "human" | "model" | "work";

/** A single bar on a timeline lane, in chart time units. */
export interface TimelineSpan {
	start: number;
	end: number;
	label?: string;
	kind: SpanKind;
	/**
	 * Which edge the label anchors to. Labels never truncate, so a narrow span
	 * whose right neighbor starts immediately should anchor "end" to spill
	 * into empty track on its left instead.
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

function lastEnd(lane: TimelineLane): number {
	return lane.spans.reduce((max, span) => Math.max(max, span.end), 0);
}

/**
 * A lane/Gantt chart of speech, generation, and tool work over time.
 *
 * With `playSeconds` set, it renders empty tracks until scrolled into view,
 * then sweeps a playhead across the chart in real time, revealing spans as
 * they "happen". Readers can scrub the timeline, skip to the end, or replay.
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

	const pct = (value: number) => `${(value / duration) * 100}%`;
	const shownT = mode === "static" ? duration : t;
	const sweeping = mode === "playing" || mode === "scrubbing";

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
		<div className="lane-chart" ref={rootRef}>
			<div className="lane-axis">
				<div className="lane-axis-label">time</div>
				<div className="lane-axis-ticks">
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
									<div className="lane-track">
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
										{/* Labels live above every bar so spilling text is never
										    painted over by a neighboring span. */}
										{lane.spans.map((span) => {
											if (!span.label || shownT <= span.start) return null;
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
										})}
									</div>
								</div>
							);
						})}
					</div>
				))}
				<div className="lane-overlay" aria-hidden="true">
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
