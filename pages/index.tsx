import { motion } from "framer-motion";

import Container from "../components/Container";

export default function Home() {
  return (
    <Container className="dark:bg-custom-dark">
      <motion.div
        className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      >
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
          Hey, I’m Nick Wall
        </h1>
        <h2 className="prose text-gray-600 dark:text-gray-400 mb-16">
          I’m a developer, and creator. I love to make fullstack applications,
          and explore the potentials of machine learning. Professionally, I am a
          student at Southern Methodist University and currently working at IBM.
          Welcome to my site.
        </h2>
      </motion.div>
    </Container>
  );
}
