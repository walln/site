import type React from "react";
import { memo } from "react";
import { motion } from "motion/react";

interface TmuxPaneProps {
	title: string;
	isActive: boolean;
	onClick: () => void;
	className?: string;
	isHorizontal?: boolean;
	children: React.ReactNode;
}

const TmuxPane = memo<TmuxPaneProps>(
	({
		title,
		isActive,
		onClick,
		className = "",
		isHorizontal = false,
		children,
	}) => {
		const paneClasses = `
    tmux-pane relative overflow-hidden bg-black transition-all duration-300
    ${isActive ? "border-accent-green/50" : "border-quote"}
    ${isHorizontal ? "border-b border-r-0" : "border-r"}
    ${isHorizontal && "last:border-b-0"}
    ${!isHorizontal && "last:border-r-0"}
    ${className}
  `;

		const titleClasses = `
    tmux-pane-title text-xs px-2 py-1 border-b font-mono
    ${isActive ? "text-accent-green bg-accent-green/5 border-accent-green/30" : "text-quote bg-black border-quote/30"}
  `;

		return (
			<motion.div
				className={paneClasses}
				onClick={onClick}
				whileHover={{ scale: 1.002 }}
				transition={{ duration: 0.1 }}
			>
				<div className={titleClasses}>{title}</div>
				<div className="tmux-pane-content p-3 overflow-hidden h-[calc(100%-1.75rem)]">
					{children}
				</div>
			</motion.div>
		);
	},
);

TmuxPane.displayName = "TmuxPane";

export default TmuxPane;
