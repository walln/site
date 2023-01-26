import Container from "@/components/Container";
import { allProjects, Project } from "contentlayer/generated";
import { useLiveReload, useMDXComponent } from "next-contentlayer/hooks";
import NextLink from "next/link";

interface LinkProps {
  href: string;
  label: string;
}

function Link(props: LinkProps) {
  return (
    <NextLink href={props.href} className="text-white underline">
      {props.label}
    </NextLink>
  );
}

interface TextBlockProps {
  text: string;
}

function TextBlock(props: TextBlockProps) {
  return <p className="py-4 text-white">{props.text}</p>;
}

export default function ProjectPage({ project }: { project: Project }) {
  const MDXContent = useMDXComponent(project.body.code);
  useLiveReload();
  return (
    <Container>
      <div className="relative mx-auto flex h-full min-h-full w-full max-w-2xl flex-col">
        <h1 className="mb-12 text-2xl font-bold text-white">{project.name}</h1>
        <MDXContent components={{ Link, TextBlock }} />
      </div>
    </Container>
  );
}

export async function getStaticPaths() {
  const paths = allProjects.map((project) => project.url);
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const project = allProjects.find(
    (project) => project._raw.flattenedPath === params.slug
  );
  return {
    props: {
      project,
    },
  };
}
