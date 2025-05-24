import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

interface FadeInProps extends HTMLMotionProps<"div"> {
	children: ReactNode;
	delay?: number;
	duration?: number;
}

const FadeIn: React.FC<FadeInProps> = ({
	children,
	delay = 0,
	duration = 0.5,
	...rest
}) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration, delay }}
			{...rest}
		>
			{children}
		</motion.div>
	);
};

export default FadeIn;
