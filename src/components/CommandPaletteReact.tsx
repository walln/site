import React, { useState, useEffect } from "react";
import { Command } from "cmdk";
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

const defaultCommands: CommandItem[] = [
	{
		name: "home",
		description: "Return to home",
		shortcut: "ctrl+h",
		action: "/",
	},
	{
		name: "projects",
		description: "View all projects",
		shortcut: "ctrl+p",
		action: "/projects",
	},
	{
		name: "search",
		description: "Search content",
		shortcut: "ctrl+k",
		action: "#search",
	},
	{
		name: "theme",
		description: "Toggle theme",
		shortcut: "ctrl+t",
		action: "#theme",
	},
];

export default function CommandPaletteReact({
	commands = [],
}: CommandPaletteProps) {
	const [open, setOpen] = useState(false);
	const allCommands = [...defaultCommands, ...commands];

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
		if (cmd.onSelect) {
			cmd.onSelect();
		} else if (cmd.action) {
			if (cmd.action.startsWith("/")) {
				window.location.href = cmd.action;
			} else if (cmd.action === "#search") {
				const searchBtn = document.querySelector('[aria-label="Search"]');
				(searchBtn as HTMLElement)?.click();
			} else if (cmd.action === "#theme") {
				const themeBtn = document.querySelector("theme-toggle button");
				(themeBtn as HTMLElement)?.click();
			}
		}
		setOpen(false);
	};

	return (
		<Command.Dialog
			open={open}
			onOpenChange={setOpen}
			className="command-dialog"
			shouldFilter={true}
		>
			<div className="command-wrapper">
				<div className="command-container">
					<h3 className="command-title">COMMAND PALETTE</h3>

					<Command.Input
						placeholder="Type a command..."
						className="command-input"
					/>

					<Command.List className="command-list">
						<Command.Empty className="command-empty">
							No results found.
						</Command.Empty>

						{allCommands.map((cmd, index) => (
							<Command.Item
								key={`${cmd.name}-${index}`}
								value={`${cmd.name} ${cmd.description}`}
								onSelect={() => executeCommand(cmd)}
								className="command-item"
							>
								<div className="command-item-content">
									<div>
										<span className="command-prefix">$</span>
										<span className="command-name">{cmd.name}</span>
										<span className="command-description">
											{cmd.description}
										</span>
									</div>
									{cmd.shortcut && (
										<kbd className="command-shortcut">{cmd.shortcut}</kbd>
									)}
								</div>
							</Command.Item>
						))}
					</Command.List>

					<div className="command-footer">
						<span>
							<kbd>↑↓</kbd> Navigate
						</span>
						<span>
							<kbd>Enter</kbd> Select
						</span>
						<span>
							<kbd>ESC</kbd> Close
						</span>
					</div>
				</div>
			</div>
		</Command.Dialog>
	);
}
