import NextLink from "next/link";
import { useRouter } from "next/router";
import { clsx } from "clsx";
import MobileMenu from "@/components/MobileMenu";
import Footer from "@/components/Footer";
import { Source_Code_Pro } from "@next/font/google";
import { motion } from "framer-motion";
import Meta from "@/components/Meta";
import { useState } from "react";

let easing = [0.6, -0.05, 0.01, 0.99];

const font = Source_Code_Pro({
  subsets: ["latin"],
  display: "auto",
  weight: "400",
});

interface NavItem {
  label: string;
  href: string;
}

export const NavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/static/resume.pdf", label: "Resume" },
];

function NavItem({ href, text }) {
  const router = useRouter();
  const isActive = router.asPath === href;

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
      <NextLink
        href={href}
        className={clsx(
          isActive
            ? "font-semibold text-gray-200"
            : "font-normal text-gray-400 ",
          "mx-3 hidden rounded-lg p-1 transition-all hover:bg-white hover:text-black sm:px-3 sm:py-2 md:inline-block"
        )}
      >
        <span className="capsize">{text}</span>
      </NextLink>
    </motion.div>
  );
}

export default function Container(props) {
  const [isMobileMenuShowing, setIsMobileMenuShowing] = useState(false);

  return (
    <div
      className={clsx("flex  min-h-screen flex-col bg-black", font.className)}
    >
      <Meta title="Nick Wall" />
      <div className="flex min-h-full flex-col justify-center px-8">
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
          className="flex flex-row"
          initial="hidden"
          animate="show"
        >
          <nav className="relative mx-auto flex w-full max-w-2xl items-center justify-between  border-gray-700 pt-8 pb-8 text-gray-100  sm:pb-16 ">
            <div className="ml-[-1.60rem] flex flex-row">
              <MobileMenu
                isMenuOpen={isMobileMenuShowing}
                setIsMenuOpen={setIsMobileMenuShowing}
              />
              {NavItems.map((item) => (
                <NavItem href={item.href} text={item.label} key={item.href} />
              ))}
            </div>
          </nav>
        </motion.div>
      </div>
      <motion.div
        layout
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
        className={
          (clsx("flex min-h-full flex-grow flex-col"),
          isMobileMenuShowing ? "hidden" : "visible")
        }
      >
        <main className="flex min-h-full justify-center px-8">
          {props.children}
        </main>
      </motion.div>
      <motion.div
        id="test"
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
        className={clsx(isMobileMenuShowing ? "hidden" : "visible")}
      >
        <Footer />
      </motion.div>
    </div>
  );
}
