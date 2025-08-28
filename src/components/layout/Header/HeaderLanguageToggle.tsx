import { useText } from "@/contexts/TextContext";
import { combineClasses } from "@/styles/design-system";
import { Globe } from "lucide-react";

type Props = {
  handle: () => void;
};

export const HeaderLanguageToggle: React.FC<Props> = (props) => {
  const { handle } = props;
  const { locale, t } = useText();
  return (
    <button
      onClick={handle}
      className={combineClasses(
        "p-2 rounded-lg transition-colors flex items-center gap-1",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
      )}
      title={t("header.changeLanguage")}
    >
      <Globe className="w-5 h-5" />
      <span className="text-xs font-medium uppercase">{locale}</span>
    </button>
  );
};
