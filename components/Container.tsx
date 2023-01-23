import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import NextLink from "next/link";
import { clsx } from "clsx";
// import { Switch } from "@headlessui/react";
import { motion } from "framer-motion";

import { Source_Code_Pro } from "@next/font/google";
import Meta from "./Meta";
import NavItem, { NavItemProps } from "./NavItem";

const font = Source_Code_Pro({
  subsets: ["latin"],
  // default, can also use "swap" to ensure custom font always shows
  display: "optional",
  weight: "400",
});

const navItems: NavItemProps[] = [
  { href: "/", label: "Home", type: "page" },
  { href: "/about", label: "About", type: "page" },
  { href: "/projects", label: "Projects", type: "page" },
  { href: "/static/resume.pdf", label: "Resume", type: "static" },
];

// const stagger = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       delay: 0.2,
//       delayChildren: 0.5,
//     },
//   },
// };

export default function Container(props) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  const { children, ...customMeta } = props;
  const router = useRouter();
  const meta = {
    title: "Nick Wall",
    description: `Full-stack developer and Machine Learning/AI enthusiast.`,
    type: "website",
    ...customMeta,
  };

  return (
    <div className={clsx("bg-black h-screen", font.className)}>
      <Meta title="Nick Wall" />
      <nav className="max-w-4xl w-full py-20 mx-auto px-8 bg-black">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                delayChildren: 0.5,
                staggerChildren: 0.4,
              },
            },
          }}
          // viewport={{ once: true }}
          // className="space-y-6"
          className="flex flex-row"
          initial="hidden"
          animate="show"
        >
          {navItems.map((item) => (
            <NavItem href={item.href} label={item.label} type={item.type} />
          ))}
        </motion.div>
      </nav>
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              delay: 3.0,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        <main id="skip" className="flex flex-col justify-center px-8">
          {children}
        </main>
      </motion.div>
    </div>
  );
}
