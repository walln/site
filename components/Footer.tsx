import Link from "next/link";

const ExternalLink = ({
  href,
  children,
}: {
  href: string;
  children: string;
}) => (
  <Link
    className="text-gray-500 transition hover:font-bold hover:text-white"
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    {children}
  </Link>
);

export default function Footer() {
  return (
    <footer className="mx-auto mb-8 flex w-full max-w-2xl flex-shrink flex-col items-start justify-center">
      <hr className="border-1 mb-8 w-full  border-white" />
      <div className="flex w-full max-w-2xl flex-row justify-center gap-4 pl-4">
        <ExternalLink href="https://github.com/walln">GitHub</ExternalLink>
        <ExternalLink href="https://twitter.com/nickwal">Twitter</ExternalLink>
        <ExternalLink href="https://linkedin.com/in/nicholasewall">
          LinkedIn
        </ExternalLink>
      </div>
    </footer>
  );
}
