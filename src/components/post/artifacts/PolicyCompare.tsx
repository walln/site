import { ArtifactFrame } from "./ArtifactFrame";
import { TimelineChart } from "./TimelineChart";

const DURATION = 100;
const REQUEST_END = 12;
const RESULT = 36;
const WORK = {
	start: REQUEST_END,
	end: RESULT,
	label: "lookup",
	kind: "work" as const,
};

interface PolicyCompareProps {
	figure?: number;
}

/** Figure: the three delegation strategies racing against the same lookup. */
export default function PolicyCompare({ figure }: PolicyCompareProps) {
	return (
		<ArtifactFrame
			figure={figure}
			title="Where the result can land"
			caption="All three strategies run the same lookup, and it finishes at the same moment in each one. What changes is how long the caller sits there before hearing the answer."
		>
			<TimelineChart
				duration={DURATION}
				ticks={[0, 25, 50, 75, 100]}
				tickSuffix=""
				playSeconds={6}
				markers={[{ at: RESULT, label: "result ready" }]}
				groups={[
					{
						lanes: [
							{
								label: "caller",
								role: "human",
								spans: [
									{
										start: 0,
										end: REQUEST_END,
										label: "Move 7 to 8?",
										kind: "speech",
									},
								],
							},
						],
					},
					{
						title: "Blocking",
						lanes: [
							{
								label: "voice",
								role: "model",
								spans: [
									{
										start: REQUEST_END,
										end: 30,
										label: "filler",
										kind: "fill",
									},
									{ start: 30, end: RESULT, kind: "wait" },
									{
										start: RESULT,
										end: 70,
										label: "8 is open?",
										kind: "speech",
									},
								],
							},
							{
								label: "work",
								role: "work",
								spans: [WORK],
							},
						],
					},
					{
						title: "Turn boundary",
						lanes: [
							{
								label: "voice",
								role: "model",
								spans: [
									{
										start: REQUEST_END,
										end: RESULT,
										label: "still talking",
										shortLabel: "talking",
										kind: "fill",
									},
									{
										start: RESULT,
										end: 62,
										label: "result unused",
										shortLabel: "unused",
										kind: "wait",
									},
									{
										start: 62,
										end: 100,
										label: "8 is open?",
										kind: "speech",
									},
								],
							},
							{
								label: "work",
								role: "work",
								spans: [WORK],
							},
						],
					},
					{
						title: "Splice",
						lanes: [
							{
								label: "voice",
								role: "model",
								spans: [
									{
										start: REQUEST_END,
										end: RESULT,
										label: "heard prefix",
										shortLabel: "prefix",
										kind: "speech",
									},
									{
										start: RESULT,
										end: 62,
										label: "8 is open?",
										kind: "speech",
									},
								],
							},
							{
								label: "work",
								role: "work",
								spans: [WORK],
							},
						],
					},
				]}
			/>
		</ArtifactFrame>
	);
}
