import { motion } from "framer-motion";

import Container from "../components/Container";
import Link from "next/link";
import Typewriter from "typewriter-effect";

//U+2022

const dot = "\u2022";

function GitHub() {
  return <Link href="https://github.com/walln">GitHub</Link>;
}

function Twitter() {
  return <Link href="https://twitter.com/nickwal">Twitter</Link>;
}

function LinkedIn() {
  return <Link href="https://linkedin.com/in/nicholasewall">LinkedIn</Link>;
}

function Dot() {
  return <div>{dot}</div>;
}

function Footer() {
  return (
    <div className="flex flex-row items-center justify-evenly flex-1">
      <GitHub />
      <Dot />
      <Twitter />
      <Dot />
      <LinkedIn />
    </div>
  );
}

export default function Home() {
  return (
    <Container>
      <motion.div
        className="flex flex-col items-start mx-auto mb-16"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                delay: 3.3,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-12 text-white">
            Nick Wall
          </h1>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                delay: 3.6,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          <p className="prose text-gray-100 mb-6">
            I am a student, software developer, and artificial intelligence
            research engineer, captivated with exploring the cutting edge of
            technology and pushing the limits of what is possible
          </p>
          <p className="prose text-gray-100 mb-6">
            IBM and Southern Methodist University Alumni
          </p>
          <p className="prose text-gray-100 mb-6">Open to opportunies</p>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                delay: 3.9,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="md:w-1/2 w-full self-center"
        >
          <Footer />
        </motion.div>
      </motion.div>
    </Container>
  );
}
