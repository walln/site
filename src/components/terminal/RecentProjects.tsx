import type React from "react";
import { motion } from "motion/react";
import TextScramble from "@/components/motion/TextScramble";

interface Project {
	slug: string;
	data: {
		title: string;
		publishDate: Date;
		tags?: string[];
	};
}

interface RecentProjectsProps {
	projects: Project[];
	maxProjects?: number;
}

const RecentProjects: React.FC<RecentProjectsProps> = ({
	projects,
	maxProjects = 6,
}) => {
	const displayProjects = projects.slice(0, maxProjects);

	const formatDate = (date: string | Date) => {
		const d = new Date(date);
		return d.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "2-digit",
		});
	};

	return (
		<section className="section-terminal">
			<h2 className="section-terminal-title">
				<TextScramble
					text="$ tail -f /var/log/projects.log"
					scrambleCharsClass="text-gray-500"
				/>
			</h2>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="terminal-content font-mono text-sm"
			>
				<div className="text-accent-green mb-2">
					$ tree ~/projects/ -L 1 --dirsfirst
				</div>
				<div className="text-quote mb-1">~/projects/</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="space-y-1"
				>
					{displayProjects.map((project, index) => {
						const isLast = index === displayProjects.length - 1;
						const treeChar = isLast ? "└──" : "├──";
						const dateStr = formatDate(project.data.publishDate);

						return (
							<motion.a
								key={project.slug}
								href={`/projects/${project.slug}`}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.4 + index * 0.05 }}
								className="group hover:bg-accent hover:bg-opacity-10 transition-all px-2 -mx-2 flex"
							>
								<span className="text-quote flex-shrink-0">{treeChar}</span>
								<div className="ml-1 flex-1">
									<span className="text-accent-2 group-hover:text-accent transition-colors">
										{project.data.title}/
									</span>
									<span className="text-quote text-xs ml-2">[{dateStr}]</span>
									{project.data.tags && project.data.tags.length > 0 && (
										<span className="text-quote text-xs ml-2">
											{project.data.tags
												.slice(0, 2)
												.map((tag) => `#${tag}`)
												.join(" ")}
										</span>
									)}
								</div>
							</motion.a>
						);
					})}

					{projects.length > maxProjects && (
						<motion.div
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4 + displayProjects.length * 0.05 }}
							className="text-quote pl-4"
						>
							└──{" "}
							<span className="text-xs italic">
								... and {projects.length - maxProjects} more
							</span>
						</motion.div>
					)}
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
					className="mt-4 text-quote text-xs"
				>
					{projects.length} directories
				</motion.div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.8 }}
				className="mt-6 text-center"
			>
				<a
					href="/projects"
					className="inline-block px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-accent-2 transition-all text-sm font-mono"
				>
					$ cd ~/projects/ →
				</a>
			</motion.div>
		</section>
	);
};

export default RecentProjects;
