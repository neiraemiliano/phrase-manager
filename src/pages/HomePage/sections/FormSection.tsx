import { PhraseForm } from "@/components/phrases/PhraseForm/PhraseForm";
import { useText } from "@/contexts/TextContext";
import clsx from "clsx";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useCallback, useState } from "react";

export const FormSection: React.FC = () => {
  const { t } = useText();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div className=" bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between my-1" onClick={toggle}>
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold  text-gray-900 dark:text-gray-100">
            {t("form.title")}
          </h2>
        </div>

        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronUp className="w-5 h-5" />
          )}
        </button>
      </div>
      <div
        className={clsx(
          "transition-all duration-300 overflow-hidden",
          isCollapsed ? "max-h-0" : "max-h-[500px] mt-6"
        )}
      >
        <PhraseForm />
      </div>
    </div>
  );
};
