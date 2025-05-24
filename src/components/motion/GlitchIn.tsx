import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlitchInProps extends HTMLMotionProps<"div"> {
	children: ReactNode;
	delay?: number;
	duration?: number; // This will be the total duration for the glitch sequence
}

const GlitchIn: React.FC<GlitchInProps> = ({
	children,
	delay = 0,
	duration = 0.7, // Adjusted default duration for a slightly longer glitch sequence
	...rest
}) => {
	const glitchVariants = {
		hidden: {
			opacity: 0,
			// Initial state can be simple, as keyframes will define the animated properties from this.
		},
		visible: {
			opacity: [0, 0.6, 0.3, 0.9, 0.2, 0.7, 0.4, 1],
			x: [0, 20, -20, 15, -15, 10, -5, 0],
			y: [0, -10, 10, -8, 8, -5, 3, 0],
			skewX: [
				"0deg",
				"8deg",
				"-8deg",
				"5deg",
				"-5deg",
				"3deg",
				"-3deg",
				"0deg",
			],
			scale: [1, 1.1, 0.9, 1.05, 0.95, 1.02, 0.98, 1],
			transition: {
				duration: duration,
				delay: delay,
				times: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1], // Adjusted timing for a more varied rhythm
				// Opacity, x, y, skewX, scale arrays all have 8 keyframes.
				// The `times` array maps each keyframe to a point in the normalized duration (0 to 1).
			},
		},
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={glitchVariants}
			{...rest}
		>
			{children}
		</motion.div>
	);
};

export default GlitchIn;
