import { useRouter } from "next/router";
import clsx from "clsx";
import Link from "next/link";
import useDelayedRender from "use-delayed-render";
import { useEffect } from "react";
import styles from "styles/mobile-menu.module.css";
import { NavItems } from "./Container";
import CrossIcon from "./icons/CrossIcon";
import MenuIcon from "./icons/MenuIcon";

interface MobileMenuItemProps {
  href: string;
  label: string;
  delay: number;
}

function MobileMenuItem({ href, label, delay }: MobileMenuItemProps) {
  const router = useRouter();
  const isActive = router.asPath === href;

  const transitionDelay = `${delay}ms`;

  return (
    <li
      className={clsx(
        "border-b border-white text-sm text-gray-200",
        isActive && "font-extrabold text-white"
      )}
      style={{ transitionDelay }}
    >
      <Link href={href} className="flex w-auto pb-4">
        {label}
      </Link>
    </li>
  );
}

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (val: boolean) => void;
}

export default function MobileMenu(props: MobileMenuProps) {
  const { isMenuOpen, setIsMenuOpen } = props;

  const { mounted: isMenuMounted, rendered: isMenuRendered } = useDelayedRender(
    isMenuOpen,
    {
      enterDelay: 20,
      exitDelay: 300,
    }
  );

  function toggleMenu() {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = "";
    } else {
      setIsMenuOpen(true);
      document.body.style.overflow = "hidden";
    }
  }

  useEffect(() => {
    return function cleanup() {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div>
      <button
        className={clsx(styles.burger, "visible  md:hidden")}
        aria-label="Toggle menu"
        type="button"
        onClick={toggleMenu}
      >
        <MenuIcon data-hide={isMenuOpen} />
        <CrossIcon data-hide={!isMenuOpen} />
      </button>
      {isMenuMounted && (
        <ul
          className={clsx(
            styles.menu,
            "absolute z-10 flex flex-col ",
            isMenuRendered && styles.menuRendered
          )}
        >
          {NavItems.map((item, index) => (
            <MobileMenuItem
              key={index}
              href={item.href}
              label={item.text}
              delay={150 + 250 * index}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
