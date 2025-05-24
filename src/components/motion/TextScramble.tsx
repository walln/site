import type React from "react";
import { useEffect, useRef, useState, useCallback } from "react";

interface TextScrambleProps {
	text: string;
	scrambleCharsClass?: string;
	finalTextClass?: string;
	delay?: number;
}

const TextScramble: React.FC<TextScrambleProps> = ({
	text,
	scrambleCharsClass = "text-green-500",
	finalTextClass = "text-white",
	delay = 100,
}) => {
	const [displayText, setDisplayText] = useState("");
	const queueRef = useRef<
		Array<{
			from: string;
			to: string;
			start: number;
			end: number;
			char?: string;
		}>
	>([]);
	const frameRef = useRef(0);
	const animationIdRef = useRef<number>();
	const chars = "!<>-_\\/[]{}—=+*^?#________";

	const randomChar = useCallback(() => {
		return chars[Math.floor(Math.random() * chars.length)];
	}, []);

	const update = useCallback(() => {
		let output = "";
		let complete = 0;

		for (let i = 0, n = queueRef.current.length; i < n; i++) {
			let { from, to, start, end, char } = queueRef.current[i];
			if (frameRef.current >= end) {
				complete++;
				output += `<span class="${finalTextClass}">${to}</span>`;
			} else if (frameRef.current >= start) {
				if (!char || Math.random() < 0.28) {
					char = randomChar();
					queueRef.current[i].char = char;
				}
				output += `<span class="${scrambleCharsClass}">${char}</span>`;
			} else {
				output += `<span class="${finalTextClass}">${from}</span>`;
			}
		}

		setDisplayText(output);

		if (complete === queueRef.current.length) {
			// Animation complete
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}
		} else {
			animationIdRef.current = requestAnimationFrame(update);
			frameRef.current++;
		}
	}, [scrambleCharsClass, finalTextClass, randomChar]);

	const setText = useCallback(
		(newText: string) => {
			const oldText = "";
			const length = Math.max(oldText.length, newText.length);
			queueRef.current = [];

			for (let i = 0; i < length; i++) {
				const from = oldText[i] || "";
				const to = newText[i] || "";
				const start = Math.floor(Math.random() * 60);
				const end = start + Math.floor(Math.random() * 60) + 20;
				queueRef.current.push({ from, to, start, end });
			}

			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}

			frameRef.current = 0;
			update();
		},
		[update],
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			setText(text);
		}, delay);

		return () => {
			clearTimeout(timer);
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}
		};
	}, [text, delay, setText]);

	// eslint-disable-next-line react/no-danger
	return (
		<span
			className="scramble-container inline-block relative z-30"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: this is for animation purposes
			dangerouslySetInnerHTML={{ __html: displayText }}
		/>
	);
};

export default TextScramble;
