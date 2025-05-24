import type React from "react";
import { motion, AnimatePresence } from "motion/react";

interface SimplifiedBootSequenceProps {
	phase: "logo" | "boot" | "commands";
	bootLines: string[];
	commands: Array<{
		cmd: string;
		output: string[];
		isTyping?: boolean;
		showOutput?: boolean;
	}>;
	showSocialLinks: boolean;
	typeDelay: number;
}

const SimplifiedBootSequence: React.FC<SimplifiedBootSequenceProps> = ({
	phase,
	bootLines,
	commands,
	showSocialLinks,
	typeDelay,
}) => {
	// Determine what to show based on phase progression
	const showLogo = phase === "logo";
	const showBoot = phase === "boot"; // Only show boot messages during boot phase
	const showCommands = phase === "commands";

	return (
		<div className="terminal-content font-mono text-sm">
			{/* ASCII Logo - only during logo phase */}
			<AnimatePresence mode="wait">
				{showLogo && (
					<motion.pre
						key="logo"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { duration: 0.6 } }}
						className="text-center text-accent-green text-xs mb-4 leading-none"
					>
						{`╔═══════════════════════════════╗
║                               ║
║    ███╗   ██╗██╗    ██╗      ║
║    ████╗  ██║██║    ██║      ║
║    ██╔██╗ ██║██║ █╗ ██║      ║
║    ██║╚██╗██║██║███╗██║      ║
║    ██║ ╚████║╚███╔███╔╝      ║
║    ╚═╝  ╚═══╝ ╚══╝╚══╝       ║
║                               ║
║    SYSTEM BOOT v1.0.0         ║
╚═══════════════════════════════╝`}
					</motion.pre>
				)}
			</AnimatePresence>

			{/* Boot Messages - transient, only during boot phase */}
			<AnimatePresence mode="wait">
				{showBoot && bootLines.length > 0 && (
					<motion.div
						key="boot-messages"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { duration: 0.7 } }}
						className="boot-messages space-y-1 text-xs text-quote mb-4"
					>
						{bootLines.map((line, i) => (
							<motion.div
								key={`boot-${line.replace(/\s/g, "-")}-${i}`}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.08 }}
								className="flex justify-between"
							>
								<span>{line}</span>
								<motion.span
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: i * 0.08 + 0.1 }}
									className="text-accent-green"
								>
									[ OK ]
								</motion.span>
							</motion.div>
						))}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Commands - show during commands phase and persist */}
			<AnimatePresence>
				{showCommands && (
					<motion.div
						key="commands"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						exit={{ opacity: 1 }}
						className="command-sequence space-y-3"
					>
						{commands.map((cmd, index) => {
							// Only show commands that are being typed or already shown
							const shouldShowCommand = cmd.isTyping || cmd.showOutput;
							if (!shouldShowCommand) return null;

							return (
								<motion.div
									key={`cmd-${cmd.cmd.replace(/\s/g, "-")}`}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
									className="command-group"
								>
									<motion.div
										className="text-accent-green"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.2 }}
									>
										{cmd.cmd}
										{cmd.isTyping && (
											<span className="terminal-cursor animate-pulse">█</span>
										)}
									</motion.div>
									<AnimatePresence>
										{cmd.showOutput && cmd.output.length > 0 && (
											<motion.div
												initial={{ opacity: 0, x: -10, height: 0 }}
												animate={{ opacity: 1, x: 0, height: "auto" }}
												exit={{ opacity: 0, x: -10, height: 0 }}
												transition={{ duration: 0.3, delay: 0.1 }}
												className="output pl-4 mt-1 space-y-1 overflow-hidden"
											>
												{cmd.output.map((line, j) => (
													<motion.div
														key={`output-${cmd.cmd.replace(/\s/g, "-")}-${j}`}
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														transition={{ delay: j * 0.05 }}
													>
														{line.startsWith("[") ? (
															<>
																<span className="text-quote">
																	{line.substring(0, 3)}
																</span>
																{line.substring(3)}
															</>
														) : line.includes("•") ? (
															<span className="text-xs text-quote uppercase">
																{line}
															</span>
														) : (
															line
														)}
													</motion.div>
												))}
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							);
						})}

						{/* Social Links */}
						<AnimatePresence>
							{showSocialLinks && (
								<motion.div
									initial={{ opacity: 0, x: -10, height: 0 }}
									animate={{ opacity: 1, x: 0, height: "auto" }}
									exit={{ opacity: 0, x: -10, height: 0 }}
									transition={{ duration: 0.4, delay: 0.2 }}
									className="social-links mt-2 flex gap-2 pl-4 text-xs flex-col overflow-hidden"
								>
									<div className="space-y-1">
										<div className="text-quote">total 4</div>
										<div>
											<span className="text-quote">-rw-r--r--</span>
											<span className="ml-2">
												<a
													href="https://github.com/walln"
													target="_blank"
													className="text-accent hover:text-accent-2 transition-colors"
													rel="noreferrer"
												>
													Github
												</a>
											</span>
										</div>
										<div>
											<span className="text-quote">-rw-r--r--</span>
											<span className="ml-2">
												<a
													href="https://twitter.com/nickwal"
													target="_blank"
													className="text-accent hover:text-accent-2 transition-colors"
													rel="noreferrer"
												>
													Twitter
												</a>
											</span>
										</div>
										<div>
											<span className="text-quote">-rw-r--r--</span>
											<span className="ml-2">
												<a
													href="https://www.linkedin.com/in/nicholasewall"
													target="_blank"
													className="text-accent hover:text-accent-2 transition-colors"
													rel="noreferrer"
												>
													LinkedIn
												</a>
											</span>
										</div>
										<div>
											<span className="text-quote">-rw-r--r--</span>
											<span className="ml-2">
												<a
													href="mailto:walln@hey.com"
													className="text-accent hover:text-accent-2 transition-colors"
												>
													Email
												</a>
											</span>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default SimplifiedBootSequence;
