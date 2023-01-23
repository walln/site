import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import getProjects from "@/lib/projects";

let easing = [0.6, -0.05, 0.01, 0.99];

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delay: 0.2,
      delayChildren: 0.5,
    },
  },
};

interface project {
  link: string;
  title: string;
  description: string;
}

export default function About({ projects }: { projects: project[] }) {
  return (
    <Container title="Projects – Nick Wall">
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <div className="mx-auto mb-16 flex max-w-2xl flex-col items-start justify-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Projects
          </h1>
          <div className="prose mb-8 leading-6 text-gray-100 ">
            <p>
              Here is a collection of my favorite projects that I have
              completed. I am always working on several projects, if you are
              interested in seeing some incomplete stuff then take a look at my
              &nbsp;
              <Link
                href="https://github.com/walln"
                className="font-bold text-white"
              >
                GitHub
              </Link>
              . Most of my work is not publicly available, but I can demo some
              snippets upon request.
            </p>
          </div>
          {projects && (
            <motion.div
              variants={stagger}
              className="space-y-6"
              initial="hidden"
              animate="show"
            >
              {projects.map((project) => (
                <Link key={project.title} href={project.link} legacyBehavior>
                  <motion.div
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      href={project.link}
                    />
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </Container>
  );
}

export async function getStaticProps() {
  const projects = getProjects();
  return {
    props: {
      projects: projects,
    },
  };
}
