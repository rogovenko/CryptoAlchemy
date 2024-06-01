import { AnimatePresence } from "framer-motion";

export const topIn = {
  initial: {
    opacity: 0.2,
    y: "-25%",
  },
  animate: {
    opacity: 1,
    y: "0%",
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
  revert: {
    opacity: 0.2,
    y: "-25%",
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};


export const botIn = {
  initial: {
    opacity: 0.2,
    y: "25%",
  },
  animate: {
    opacity: 1,
    y: "0%",
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
  revert: {
    opacity: 0.2,
    y: "25%",
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};


function AnimationProvider({ children }: { children: React.ReactNode }) {
  return <AnimatePresence>{children}</AnimatePresence>;
}

export default AnimationProvider;