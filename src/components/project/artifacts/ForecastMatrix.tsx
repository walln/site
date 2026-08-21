import { ArtifactFrame } from "./ArtifactFrame";

type Verdict = "right" | "wrong";

interface ForecastCellContent {
	title: string;
	note: string;
	verdict: Verdict;
}

interface ForecastMatrixProps {
	figure?: number;
}

const silentReady: ForecastCellContent = {
	title: "Direct answer",
	note: "The fact is already there.",
	verdict: "right",
};

const silentLate: ForecastCellContent = {
	title: "Dead air",
	note: "The pause runs long.",
	verdict: "wrong",
};

const holdReady: ForecastCellContent = {
	title: "Needless filler",
	note: "“Let me check” into a ready answer.",
	verdict: "wrong",
};

const holdLate: ForecastCellContent = {
	title: "Gap covered",
	note: "Filler matches the wait.",
	verdict: "right",
};

/** Figure: the 2×2 of backchannel decisions versus result timing. */
export default function ForecastMatrix({ figure }: ForecastMatrixProps) {
	return (
		<ArtifactFrame
			figure={figure}
			title="A backchannel is a latency forecast"
			caption="Playing a filler is only right when the result will actually be late. Both mistakes are audible."
		>
			<div className="forecast-matrix">
				<div className="forecast-corner" />
				<div className="forecast-head">Result ready</div>
				<div className="forecast-head">Result late</div>
				<div className="forecast-row-label">Stay silent</div>
				<ForecastCell cell={silentReady} />
				<ForecastCell cell={silentLate} />
				<div className="forecast-row-label">Play a filler</div>
				<ForecastCell cell={holdReady} />
				<ForecastCell cell={holdLate} />
			</div>
		</ArtifactFrame>
	);
}

function VerdictMark({ verdict }: { verdict: Verdict }) {
	switch (verdict) {
		case "right":
			return (
				<svg
					className="forecast-mark"
					viewBox="0 0 12 12"
					aria-label="works"
					role="img"
				>
					<path
						d="M2 6.5 L5 9.5 L10 2.75"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			);
		case "wrong":
			return (
				<svg
					className="forecast-mark"
					viewBox="0 0 12 12"
					aria-label="audible mistake"
					role="img"
				>
					<path
						d="M3 3 L9 9 M9 3 L3 9"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
					/>
				</svg>
			);
		default: {
			const exhaustive: never = verdict;
			return exhaustive;
		}
	}
}

function ForecastCell({ cell }: { cell: ForecastCellContent }) {
	return (
		<div className={`forecast-cell forecast-cell-${cell.verdict}`}>
			<div className="forecast-cell-head">
				<VerdictMark verdict={cell.verdict} />
				<span className="forecast-cell-title">{cell.title}</span>
			</div>
			<p>{cell.note}</p>
		</div>
	);
}
