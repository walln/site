import { motion } from 'framer-motion';
import Link from 'next/link';

import Container from '../components/Container';

export default function About() {
  return (
    <Container title="About – Nick Wall">
      <motion.div
        className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      >
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
          About Me
        </h1>
        <div className="mb-8 prose leading-6 text-gray-600 dark:text-gray-400">
          <p>
            I’m Nick. I'm a developer who is interested in web technologies, full stack-development,
            and Artificial Intelligence. I am currently a student at&nbsp;
            <Link href="https://www.smu.edu/">
              <a>Southern Methodist University</a>
            </Link>
            , and I am currently looking for employment opportunities.
          </p>
          <p>
            I currently study computer science with a focus on Machine Learning and Artificial
            Intelligence, I am expected to complete my undergrad in May 2023 and following
            graduation I will enter a joint program to complete my M.Sc. and MBA.
          </p>
        </div>
      </motion.div>
    </Container>
  );
}
