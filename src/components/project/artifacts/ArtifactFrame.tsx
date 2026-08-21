import type { ReactNode } from "react";

interface ArtifactFrameProps {
	kicker?: string;
	figure?: number;
	title?: string;
	caption?: string;
	wide?: boolean;
	children: ReactNode;
	controls?: ReactNode;
}

export function ArtifactFrame({
	kicker,
	figure,
	title,
	caption,
	wide = false,
	children,
	controls,
}: ArtifactFrameProps) {
	const panelTitle = title ?? kicker;
	const panelLead = title ? kicker : undefined;

	return (
		<figure
			className={
				wide ? "artifact artifact-wide not-prose" : "artifact not-prose"
			}
		>
			<div className="artifact-panel">
				{panelTitle && (
					<div className="artifact-panel-copy">
						<div className="artifact-panel-title">{panelTitle}</div>
						{panelLead && <p>{panelLead}</p>}
					</div>
				)}
				<div className="artifact-stage">{children}</div>
				{controls}
			</div>
			{(figure != null || caption) && (
				<figcaption className="artifact-caption">
					{figure != null && (
						<span className="artifact-figure-label">Figure {figure}</span>
					)}
					{figure != null && caption ? ": " : null}
					{caption}
				</figcaption>
			)}
		</figure>
	);
}
