import React from "react";
import { LucideIcon } from "lucide-react";
import { AnimatedContainer } from "@components/common/AnimatedContainer/AnimatedContainer";
import clsx from "clsx";

type StatCardColor = "blue" | "purple" | "green" | "yellow" | "pink" | "indigo";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: StatCardColor;
  animationDelay?: number;
}

export const PhraseStats: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  color,
  animationDelay = 0,
}) => {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    purple: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
    green: "text-green-500 bg-green-100 dark:bg-green-900/30",
    yellow: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30",
    pink: "text-pink-500 bg-pink-100 dark:bg-pink-900/30",
    indigo: "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30",
  };

  return (
    <AnimatedContainer delay={animationDelay}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between mb-2">
          <div className={clsx("p-2 rounded-lg", colorClasses[color])}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value.toLocaleString()}
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
      </div>
    </AnimatedContainer>
  );
};
