import { useText } from "@/contexts/TextContext";
import { useStore } from "@/store";
import { THEME } from "@/utils";
import { Moon, Sun } from "lucide-react";
import React from "react";

type Props = {
  handle: () => void;
};

export const HeaderThemeToggle: React.FC<Props> = (props) => {
  const { handle } = props;
  const { state } = useStore();
  const { t } = useText();

  return (
    <button
      onClick={handle}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={
        state.theme === THEME.DARK
          ? t("header.lightMode")
          : t("header.darkMode")
      }
    >
      {state.theme === THEME.DARK ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};
