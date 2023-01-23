import Link from "next/link";
import { motion } from "framer-motion";

export interface NavItemProps {
  href: string;
  label: string;
  type: "page" | "static";
}

let easing = [0.6, -0.05, 0.01, 0.99];

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 5.0, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 5.0,
      ease: easing,
    },
  },
};

export default function NavItem(props: NavItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { scale: 0, top: 100, opacity: 0 },
        show: { scale: 1, top: 30, opacity: 1 },
      }}
      animate={{
        transition: {
          duration: 1.0,
          ease: easing,
        },
      }}
    >
      <Link
        href={props.href}
        className="rounded-lg px-2 py-1 text-gray-100 hover:bg-gray-300"
        rel={props.type == "static" && "noopener noreferrer"}
        target={props.type == "static" && "_blank"}
      >
        {props.label}
      </Link>
    </motion.div>
  );
}
