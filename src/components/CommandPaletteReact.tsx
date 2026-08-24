import { menuLinks } from "@/site.config";
import { navigate } from "astro:transitions/client";
import { Command } from "cmdk";
import { useEffect, useState } from "react";
import "./CommandPalette.css";

export interface CommandItem {
	name: string;
	description: string;
	shortcut?: string;
	action?: string;
	onSelect?: () => void;
}

interface CommandPaletteProps {
	commands?: CommandItem[];
}

const pageDescriptions: Record<string, string> = {
	"/": "return to the front page",
	"/blog": "browse all posts",
	"/resume": "experience and background",
};

const navigationCommands: CommandItem[] = menuLinks.map((link) => ({
	name: link.title.toLowerCase(),
	description:
		pageDescriptions[link.path] ?? `go to ${link.title.toLowerCase()}`,
	action: link.path,
}));

export default function CommandPaletteReact({
	commands = [],
}: CommandPaletteProps) {
	const [open, setOpen] = useState(false);

	// Toggle the menu when ⌘K is pressed
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const executeCommand = (cmd: CommandItem) => {
		setOpen(false);
		if (cmd.onSelect) {
			cmd.onSelect();
		} else if (cmd.action?.startsWith("/")) {
			navigate(cmd.action);
		}
	};

	const renderItem = (cmd: CommandItem, index: number) => (
		<Command.Item
			key={`${cmd.name}-${index}`}
			value={`${cmd.name} ${cmd.description}`}
			onSelect={() => executeCommand(cmd)}
			className="command-item"
		>
			<div className="command-item-content">
				<span className="command-name">{cmd.name}</span>
				<span className="command-description">{cmd.description}</span>
				{cmd.shortcut && <kbd className="command-shortcut">{cmd.shortcut}</kbd>}
			</div>
		</Command.Item>
	);

	return (
		<Command.Dialog
			open={open}
			onOpenChange={setOpen}
			label="Command palette"
			shouldFilter={true}
		>
			<div
				className="command-screen"
				onClick={(e) => {
					if (e.target === e.currentTarget) setOpen(false);
				}}
			>
				<div className="command-panel">
					<Command.Input placeholder="where to?" className="command-input" />

					<Command.List className="command-list">
						<Command.Empty className="command-empty">
							nothing found.
						</Command.Empty>

						<Command.Group heading="go to">
							{navigationCommands.map(renderItem)}
						</Command.Group>

						{commands.length > 0 && (
							<Command.Group heading="commands">
								{commands.map(renderItem)}
							</Command.Group>
						)}
					</Command.List>

					<div className="command-footer">
						<span>
							<kbd>↑↓</kbd> navigate
						</span>
						<span>
							<kbd>↵</kbd> select
						</span>
						<span>
							<kbd>esc</kbd> close
						</span>
					</div>
				</div>
			</div>
		</Command.Dialog>
	);
}
