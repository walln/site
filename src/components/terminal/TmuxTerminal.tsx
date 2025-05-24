import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import SimplifiedBootSequence from "./SimplifiedBootSequence.tsx";
import TmuxPane from "./TmuxPane.tsx";
import {
	GitHubLogoIcon,
	TwitterLogoIcon,
	LinkedInLogoIcon,
	EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import { useMachine } from "@xstate/react";
import { terminalMachine } from "./terminalMachine";
import { bootMessages, commandData } from "./terminalMachine";

interface SystemStatus {
	uptime: string;
	lastDeploy: string;
	activeProjects: number;
	status: string;
}

interface Project {
	slug: string;
	data: {
		title: string;
		publishDate: Date;
		tags?: string[];
	};
}

interface TmuxTerminalProps {
	systemStatus: SystemStatus;
	projects: Project[];
}

const TmuxTerminal: React.FC<TmuxTerminalProps> = ({
	systemStatus,
	projects,
}) => {
	const [state, send] = useMachine(terminalMachine);
	const [currentTime, setCurrentTime] = useState(new Date());

	// Derived state from machine
	const isInBootSequence = state.matches("bootSequence");
	const showSidePanes =
		state.matches("showingSidePanes") || state.matches("completed");
	const isCompleted = state.matches("completed");

	const {
		hasSeenBoot,
		isMobile,
		activePaneIndex,
		bootPhase,
		bootLines,
		commands,
		showSocialLinks,
	} = state.context;

	// Check for mobile viewport
	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.innerWidth < 768;
			send({ type: "SET_MOBILE", isMobile: mobile });
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [send]);

	// Update time
	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div
			className={`tmux-container relative border border-quote bg-black rounded-sm ${isMobile && showSidePanes ? "h-auto" : "h-[70vh] min-h-[500px] max-h-[800px]"} flex flex-col shadow-lg overflow-hidden`}
		>
			<div
				className={`tmux-panes ${isMobile && showSidePanes ? "" : "flex-1"} ${isMobile ? "flex flex-col" : "flex"} overflow-hidden`}
			>
				{/* Main Pane */}
				<TmuxPane
					title="nwall@cluster-001:~"
					isActive={activePaneIndex === 0}
					onClick={() => send({ type: "SET_ACTIVE_PANE", index: 0 })}
					className={
						isMobile ? "h-[500px]" : showSidePanes ? "flex-[2]" : "flex-1"
					}
				>
					{/* Always show the boot sequence component to prevent unmounting */}
					<div className="min-h-[300px]">
						<SimplifiedBootSequence
							phase={
								state.matches("bootSequence.logo")
									? "logo"
									: state.matches("bootSequence.bootMessages")
										? "boot"
										: "commands" // Default to commands for all other states
							}
							bootLines={bootLines}
							commands={commands}
							showSocialLinks={showSocialLinks}
							typeDelay={hasSeenBoot ? 10 : 30}
						/>
						{/* Reserve space for tmux commands to prevent layout shift */}
						<div
							className={`transition-all duration-300 ${
								state.matches("showingSidePanes") ||
								state.matches("completed") ||
								state.matches("postBootDelay")
									? "mt-4"
									: "mt-0 h-0 overflow-hidden"
							}`}
						>
							{/* Show tmux commands after boot sequence completes */}
							{(state.matches("showingSidePanes") ||
								state.matches("completed") ||
								state.matches("postBootDelay")) && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5 }}
								>
									<motion.div
										className="text-accent-green"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.6 }}
									>
										$ tmux split-window -h -p 35
									</motion.div>
									<motion.div
										className="text-accent-green mt-2"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 1.2 }}
									>
										$ tmux split-window -v
									</motion.div>
									<motion.div
										className="text-accent-green mt-4"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 1.8 }}
									>
										$ <span className="terminal-cursor animate-pulse">█</span>
									</motion.div>
								</motion.div>
							)}
						</div>
					</div>
				</TmuxPane>

				{/* Side Panes */}
				<AnimatePresence>
					{showSidePanes && (
						<motion.div
							initial={
								isMobile ? { height: 0, opacity: 0 } : { width: 0, opacity: 0 }
							}
							animate={
								isMobile
									? { height: "auto", opacity: 1 }
									: { width: "35%", opacity: 1 }
							}
							exit={
								isMobile ? { height: 0, opacity: 0 } : { width: 0, opacity: 0 }
							}
							transition={{ duration: 0.3 }}
							className={isMobile ? "w-full" : "flex flex-col"}
						>
							{/* On mobile, show as a separate bottom pane */}
							{isMobile ? (
								<>
									{/* System Status Pane */}
									<TmuxPane
										title="nwall@cluster-001:~/status"
										isActive={activePaneIndex === 1}
										onClick={() => send({ type: "SET_ACTIVE_PANE", index: 1 })}
										className="h-[250px]"
										isHorizontal
									>
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.3 }}
											className="terminal-content"
										>
											<div className="text-accent-green mb-2">
												$ systemctl status
											</div>
											<motion.div
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 0.6 }}
												className="space-y-2 pl-4"
											>
												<div className="flex items-center gap-2">
													<span className="inline-block w-2 h-2 bg-accent-green rounded-full animate-pulse" />
													<span className="text-quote">nwall.service</span>
												</div>
												<div className="text-quote space-y-1 text-xs">
													<div className="pl-4">
														Active: active (running) since {systemStatus.uptime}{" "}
														ago
													</div>
													<div className="pl-4">Main PID: 1337 (neuron)</div>
													<div className="pl-4">
														Tasks: {systemStatus.activeProjects} (limit: 512)
													</div>
													<div className="pl-4">Memory: 12.6GB</div>
													<div className="pl-4">CPU: 42.0%</div>
												</div>
											</motion.div>
										</motion.div>
									</TmuxPane>

									{/* Quick Links Pane */}
									<TmuxPane
										title="nwall@cluster-001:~/links"
										isActive={activePaneIndex === 2}
										onClick={() => send({ type: "SET_ACTIVE_PANE", index: 2 })}
										className="h-[220px]"
										isHorizontal
									>
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.9 }}
											className="terminal-content"
										>
											<div className="text-accent-green mb-2 text-xs">
												$ ls -la ~/bookmarks/
											</div>
											<motion.div
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 1.2 }}
												className="space-y-1 text-xs pl-2"
											>
												<div className="text-quote">total 8</div>
												<a
													href="/projects"
													className="block hover:bg-accent hover:bg-opacity-10 transition-all py-0.5"
												>
													<span className="text-quote">drwxr-xr-x</span>
													<span className="ml-2">projects/</span>
												</a>
												<a
													href="/tags"
													className="block hover:bg-accent hover:bg-opacity-10 transition-all py-0.5"
												>
													<span className="text-quote">drwxr-xr-x</span>
													<span className="ml-2">tags/</span>
												</a>
												<div className="mt-3 text-xs">
													<span className="text-quote block mb-2">
														Find me on:
													</span>
													<div className="flex flex-row gap-3">
														<a
															href="https://github.com/walln"
															target="_blank"
															className="text-accent hover:text-accent-2 transition-colors"
															rel="noreferrer"
														>
															<GitHubLogoIcon className="w-4 h-4" />
															<span className="sr-only">Github</span>
														</a>
														<a
															href="https://twitter.com/nickwal"
															target="_blank"
															className="text-accent hover:text-accent-2 transition-colors"
															rel="noreferrer"
														>
															<TwitterLogoIcon className="w-4 h-4" />
															<span className="sr-only">Twitter</span>
														</a>
														<a
															href="https://www.linkedin.com/in/nicholasewall"
															target="_blank"
															className="text-accent hover:text-accent-2 transition-colors"
															rel="noreferrer"
														>
															<LinkedInLogoIcon className="w-4 h-4" />
															<span className="sr-only">LinkedIn</span>
														</a>
														<a
															href="mailto:walln@hey.com"
															className="text-accent hover:text-accent-2 transition-colors"
															rel="noreferrer"
														>
															<EnvelopeClosedIcon className="w-4 h-4" />
															<span className="sr-only">Email</span>
														</a>
													</div>
												</div>
											</motion.div>
										</motion.div>
									</TmuxPane>
								</>
							) : (
								<>
									{/* System Status Pane */}
									<TmuxPane
										title="nwall@cluster-001:~/status"
										isActive={activePaneIndex === 1}
										onClick={() => send({ type: "SET_ACTIVE_PANE", index: 1 })}
										className="flex-1"
										isHorizontal
									>
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.3 }}
											className="terminal-content"
										>
											<div className="text-accent-green mb-2">
												$ systemctl status
											</div>
											<motion.div
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 0.6 }}
												className="space-y-2 pl-4"
											>
												<div className="flex items-center gap-2">
													<span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
													<span className="text-quote">nwall.service</span>
												</div>
												<div className="text-quote space-y-1 text-xs">
													<div>
														Active: active (running) since {systemStatus.uptime}{" "}
														ago
													</div>
													<div>Main PID: 1337 (neuron)</div>
													<div>
														Tasks: {systemStatus.activeProjects} (limit: 512)
													</div>
													<div>Memory: 12.6GB</div>
													<div>CPU: 42.0%</div>
												</div>
											</motion.div>
										</motion.div>
									</TmuxPane>

									{/* Quick Links Pane */}
									<TmuxPane
										title="nwall@cluster-001:~/links"
										isActive={activePaneIndex === 2}
										onClick={() => send({ type: "SET_ACTIVE_PANE", index: 2 })}
										className="flex-1"
										isHorizontal
									>
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.9 }}
											className="terminal-content"
										>
											<div className="text-accent-green mb-2 text-xs">
												$ ls -la ~/bookmarks/
											</div>
											<motion.div
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 1.2 }}
												className="space-y-1 text-xs pl-2"
											>
												<div className="text-quote">total 8</div>
												<a
													href="/projects"
													className="block hover:bg-accent hover:bg-opacity-10 transition-all py-0.5"
												>
													<span className="text-quote">drwxr-xr-x</span>
													<span className="ml-2">projects/</span>
												</a>
												<a
													href="/tags"
													className="block hover:bg-accent hover:bg-opacity-10 transition-all py-0.5"
												>
													<span className="text-quote">drwxr-xr-x</span>
													<span className="ml-2">tags/</span>
												</a>
												<div className="mt-3 text-xs">
													<span className="text-quote block mb-2">
														Find me on:
													</span>
													<div className="flex flex-row gap-3">
														<a
															href="https://github.com/walln"
															target="_blank"
															className="text-accent hover:text-accent-2 transition-colors"
															rel="noreferrer"
														>
															<GitHubLogoIcon className="w-4 h-4" />
															<span className="sr-only">Github</span>
														</a>
														<a
															href="https://twitter.com/nickwal"
															target="_blank"
															className="text-accent hover:text-accent-2 transition-colors"
															rel="noreferrer"
														>
															<TwitterLogoIcon className="w-4 h-4" />
															<span className="sr-only">Twitter</span>
														</a>
														<a
															href="https://www.linkedin.com/in/nicholasewall"
															target="_blank"
															className="text-accent hover:text-accent-2 transition-colors"
															rel="noreferrer"
														>
															<LinkedInLogoIcon className="w-4 h-4" />
															<span className="sr-only">LinkedIn</span>
														</a>
														<a
															href="mailto:walln@hey.com"
															className="text-accent hover:text-accent-2 transition-colors"
															rel="noreferrer"
														>
															<EnvelopeClosedIcon className="w-4 h-4" />
															<span className="sr-only">Email</span>
														</a>
													</div>
												</div>
											</motion.div>
										</motion.div>
									</TmuxPane>
								</>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* tmux status bar */}
			<div className="tmux-status-bar bg-black text-quote text-xs px-2 py-1 border-t border-quote/30">
				<div className="flex justify-between items-center">
					<div className="flex gap-4">
						<span
							className={`tmux-status-item px-2 py-0.5 ${activePaneIndex === 0 ? "text-accent-green bg-accent-green/10" : "bg-quote/10"}`}
						>
							[0] {isMobile ? "terminal" : "main"}
						</span>
						{isMobile && showSidePanes && (
							<>
								<span
									className={`tmux-status-item px-2 py-0.5 ${activePaneIndex === 1 ? "text-accent-green bg-accent-green/10" : "bg-quote/10"}`}
								>
									[1] status
								</span>
								<span
									className={`tmux-status-item px-2 py-0.5 ${activePaneIndex === 2 ? "text-accent-green bg-accent-green/10" : "bg-quote/10"}`}
								>
									[2] links
								</span>
							</>
						)}
					</div>
					<div className="flex gap-4">
						<span className="text-quote">"admin@root"</span>
						<span className="text-quote">{formatTime(currentTime)}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TmuxTerminal;
