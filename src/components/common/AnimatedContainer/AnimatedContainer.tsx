import { Animation } from "@/types";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

interface AnimatedContainerProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  animation?: Animation;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  delay = 0,
  className,
  animation = "fade",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animationClasses = {
    fade: isVisible ? "opacity-100" : "opacity-0",
    "slide-up": isVisible
      ? "opacity-100 transform translate-y-0"
      : "opacity-0 transform translate-y-4",
    "slide-down": isVisible
      ? "opacity-100 transform translate-y-0"
      : "opacity-0 transform -translate-y-4",
    scale: isVisible
      ? "opacity-100 transform scale-100"
      : "opacity-0 transform scale-95",
  };

  return (
    <div
      className={clsx(
        "transition-all duration-300",
        animationClasses[animation],
        className
      )}
    >
      {children}
    </div>
  );
};
