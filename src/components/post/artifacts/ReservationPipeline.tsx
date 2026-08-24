import { ArtifactFrame } from "./ArtifactFrame";
import { TimelineChart } from "./TimelineChart";

const GEN = 0.8;
const VOICE_TO_VOICE = 0.7;
const LOOKUP = 2.0;
const AVAIL = 2.2;
const UPDATE = 2.0;
const CALLER_Q = 2.0;
const CALLER_YES = 0.5;
const ASK_SPEECH = 2.2;
const DONE_SPEECH = 1.5;

const callerEnd = CALLER_Q;
const gen1End = callerEnd + GEN;
const lookupEnd = gen1End + LOOKUP;
const gen2End = lookupEnd + GEN;
const availEnd = gen2End + AVAIL;
const askStart = availEnd + VOICE_TO_VOICE;
const askEnd = askStart + ASK_SPEECH;
const yesEnd = askEnd + CALLER_YES;
const gen4End = yesEnd + GEN;
const updateEnd = gen4End + UPDATE;
const doneStart = updateEnd + VOICE_TO_VOICE;
const done = doneStart + DONE_SPEECH;

const HUMAN_START = 1.5;
const HUMAN_END = 3.5;

interface ReservationPipelineProps {
	figure?: number;
}

/** Figure: the reservation change played out in real time, human vs. agent. */
export default function ReservationPipeline({
	figure,
}: ReservationPipelineProps) {
	return (
		<ArtifactFrame
			figure={figure}
			title="The agent is a pipeline"
			caption="This plays in real time. The host handles it while still talking. The agent pays five TTFTs, five decodes, and three tool executions before the caller gets an answer."
		>
			<TimelineChart
				duration={done}
				ticks={[0, 4, 8, 12, 16]}
				playSeconds={done}
				showClock
				groups={[
					{
						lanes: [
							{
								label: "human",
								role: "human",
								total: "3.5s",
								spans: [
									{
										start: HUMAN_START,
										end: HUMAN_END,
										label: "let me see… yep, 8 works",
										kind: "speech",
									},
								],
							},
							{
								label: "caller",
								role: "human",
								spans: [
									{
										start: 0,
										end: callerEnd,
										label: "Move 7 to 8?",
										kind: "speech",
									},
									{
										start: askEnd,
										end: yesEnd,
										label: "Yes",
										kind: "speech",
									},
								],
							},
							{
								label: "voice",
								role: "model",
								total: `${done.toFixed(1)}s`,
								spans: [
									{
										start: callerEnd,
										end: gen1End,
										label: "gen 1",
										kind: "gen",
									},
									{
										start: lookupEnd,
										end: gen2End,
										label: "gen 2",
										kind: "gen",
									},
									{
										start: availEnd,
										end: askStart,
										label: "gen 3",
										kind: "gen",
										labelAlign: "end",
									},
									{
										start: askStart,
										end: askEnd,
										label: "8 is open?",
										shortLabel: "open?",
										kind: "speech",
									},
									{ start: yesEnd, end: gen4End, label: "gen 4", kind: "gen" },
									{
										start: updateEnd,
										end: doneStart,
										label: "gen 5",
										kind: "gen",
										labelAlign: "end",
									},
									{
										start: doneStart,
										end: done,
										label: "You're set",
										shortLabel: "set",
										kind: "speech",
										labelAlign: "end",
									},
								],
							},
							{
								label: "tools",
								role: "work",
								spans: [
									{
										start: gen1End,
										end: lookupEnd,
										label: "lookup",
										kind: "work",
									},
									{
										start: gen2End,
										end: availEnd,
										label: "availability",
										kind: "work",
									},
									{
										start: gen4End,
										end: updateEnd,
										label: "update",
										kind: "work",
									},
								],
							},
						],
					},
				]}
			/>
		</ArtifactFrame>
	);
}
