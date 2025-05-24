import { createMachine, assign } from "xstate";

// Boot sequence data
export const bootMessages = [
	"System initializing...",
	"Loading kernel modules...",
	"Starting services...",
	"Mounting filesystems...",
	"Starting network interfaces...",
	"Loading user profile...",
];

export const commandData = [
	{
		cmd: "$ whoami",
		output: ["Nick Wall", "Research Engineer • Member of Technical Staff"],
	},
	{
		cmd: "$ current --status",
		output: ["Leading Engineering & Research @ Maple"],
	},
	{
		cmd: "$ history --employers",
		output: [
			"[0] Independent Research",
			"[1] IBM",
			"[2] Southern Methodist University",
		],
	},
	{
		cmd: "$ social --links",
		output: [],
	},
];

// Terminal machine context
export interface TerminalContext {
	hasSeenBoot: boolean;
	isMobile: boolean;
	activePaneIndex: number;
	wasCompletedOnLoad: boolean;
	// Boot sequence state
	bootPhase: "logo" | "boot" | "commands";
	bootLines: string[];
	currentBootLineIndex: number;
	commands: Array<{
		cmd: string;
		output: string[];
		isTyping: boolean;
		showOutput: boolean;
	}>;
	currentCommandIndex: number;
	showSocialLinks: boolean;
}

// Terminal machine events
export type TerminalEvent =
	| { type: "NEXT_BOOT_LINE" }
	| { type: "START_COMMANDS" }
	| { type: "NEXT_COMMAND" }
	| { type: "SHOW_COMMAND_OUTPUT" }
	| { type: "SHOW_SOCIAL_LINKS" }
	| { type: "SET_ACTIVE_PANE"; index: number }
	| { type: "SET_MOBILE"; isMobile: boolean };

// Helper to get animation delays based on fastBoot
const getDelays = (context: TerminalContext) => {
	const fastBoot = context.hasSeenBoot;
	return {
		logoDelay: fastBoot ? 800 : 1500,
		bootLineDelay: fastBoot ? 50 : 150,
		commandTypeDelay: fastBoot ? 600 : 1200,
		commandOutputDelay: fastBoot ? 400 : 800,
		phaseTransitionDelay: fastBoot ? 800 : 1200,
		logoToBootDelay: fastBoot ? 600 : 1000, // Increased - wait for logo fade out
		bootToCommandsDelay: fastBoot ? 800 : 1200, // Increased - wait for boot messages fade out
	};
};

// Create the terminal state machine
export const terminalMachine = createMachine(
	{
		id: "terminal",
		initial: "checkingHistory",
		context: {
			hasSeenBoot: false,
			isMobile: false,
			activePaneIndex: 0,
			wasCompletedOnLoad: false,
			bootPhase: "logo",
			bootLines: [],
			currentBootLineIndex: 0,
			commands: commandData.map((cmd) => ({
				...cmd,
				isTyping: false,
				showOutput: false,
			})),
			currentCommandIndex: 0,
			showSocialLinks: false,
		} as TerminalContext,
		states: {
			checkingHistory: {
				entry: assign({
					hasSeenBoot: () => {
						if (typeof window !== "undefined") {
							return localStorage.getItem("hasSeenBoot") === "true";
						}
						return false;
					},
				}),
				always: [{ target: "bootSequence.logo" }],
			},
			bootSequence: {
				initial: "logo",
				states: {
					logo: {
						entry: assign({
							bootPhase: () => "logo" as const,
						}),
						after: {
							LOGO_DELAY: "waitingForBootMessages",
						},
					},
					waitingForBootMessages: {
						// Wait for logo to fade out
						after: {
							LOGO_TO_BOOT_DELAY: "bootMessages",
						},
					},
					bootMessages: {
						entry: assign({
							bootPhase: () => "boot" as const,
						}),
						initial: "addingLine",
						states: {
							addingLine: {
								entry: assign({
									bootLines: ({ context }) => {
										const { currentBootLineIndex } = context;
										if (currentBootLineIndex < bootMessages.length) {
											return [
												...context.bootLines,
												bootMessages[currentBootLineIndex],
											];
										}
										return context.bootLines;
									},
									currentBootLineIndex: ({ context }) =>
										context.currentBootLineIndex + 1,
								}),
								always: [
									{
										target: "waitingForNext",
										guard: ({ context }) =>
											context.currentBootLineIndex < bootMessages.length,
									},
									{
										target: "#terminal.bootSequence.waitingForCommands",
									},
								],
							},
							waitingForNext: {
								after: {
									BOOT_LINE_DELAY: "addingLine",
								},
							},
						},
					},
					waitingForCommands: {
						// Wait for boot messages to fade out
						after: {
							BOOT_TO_COMMANDS_DELAY: "commands",
						},
					},
					commands: {
						entry: assign({
							bootPhase: () => "commands" as const,
						}),
						initial: "waitForTransition",
						states: {
							waitForTransition: {
								after: {
									PHASE_TRANSITION_DELAY: "typingCommand",
								},
							},
							typingCommand: {
								entry: assign({
									commands: ({ context }) => {
										const { currentCommandIndex } = context;
										return context.commands.map((cmd, index) => ({
											...cmd,
											isTyping: index === currentCommandIndex,
										}));
									},
								}),
								after: {
									COMMAND_TYPE_DELAY: "showingOutput",
								},
							},
							showingOutput: {
								entry: assign({
									commands: ({ context }) => {
										const { currentCommandIndex } = context;
										return context.commands.map((cmd, index) => ({
											...cmd,
											isTyping: false,
											showOutput: index <= currentCommandIndex,
										}));
									},
								}),
								always: [
									{
										target: "checkingSocialLinks",
										guard: ({ context }) => {
											const currentCmd =
												context.commands[context.currentCommandIndex];
											return currentCmd?.cmd === "$ social --links";
										},
									},
									{
										target: "waitingForNextCommand",
									},
								],
							},
							checkingSocialLinks: {
								after: {
									400: {
										target: "nextCommand",
										actions: assign({
											showSocialLinks: () => true,
										}),
									},
								},
							},
							waitingForNextCommand: {
								after: {
									COMMAND_OUTPUT_DELAY: "nextCommand",
								},
							},
							nextCommand: {
								entry: assign({
									currentCommandIndex: ({ context }) =>
										context.currentCommandIndex + 1,
								}),
								always: [
									{
										target: "typingCommand",
										guard: ({ context }) =>
											context.currentCommandIndex < context.commands.length,
									},
									{
										target: "#terminal.postBootDelay",
									},
								],
							},
						},
					},
				},
			},
			postBootDelay: {
				entry: () => {
					if (typeof window !== "undefined") {
						localStorage.setItem("hasSeenBoot", "true");
					}
				},
				after: {
					800: "showingSidePanes",
				},
			},
			showingSidePanes: {
				after: {
					1600: "completed",
				},
			},
			completed: {
				type: "final",
			},
		},
		on: {
			SET_ACTIVE_PANE: {
				actions: assign({
					activePaneIndex: ({ event }) => event.index,
				}),
			},
			SET_MOBILE: {
				actions: assign({
					isMobile: ({ event }) => event.isMobile,
				}),
			},
		},
	},
	{
		delays: {
			LOGO_DELAY: ({ context }) => getDelays(context).logoDelay,
			BOOT_LINE_DELAY: ({ context }) => getDelays(context).bootLineDelay,
			COMMAND_TYPE_DELAY: ({ context }) => getDelays(context).commandTypeDelay,
			COMMAND_OUTPUT_DELAY: ({ context }) =>
				getDelays(context).commandOutputDelay,
			PHASE_TRANSITION_DELAY: ({ context }) =>
				getDelays(context).phaseTransitionDelay,
			LOGO_TO_BOOT_DELAY: ({ context }) => getDelays(context).logoToBootDelay,
			BOOT_TO_COMMANDS_DELAY: ({ context }) =>
				getDelays(context).bootToCommandsDelay,
		},
	},
);
