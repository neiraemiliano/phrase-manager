import { Button } from "@/components/common/Button/Button";
import { useText } from "@/contexts/TextContext";
import { useStore } from "@/store";
import { Trash2 } from "lucide-react";

type Props = {
  handleBatchDelete: () => void;
};

export const HeaderLogo: React.FC<Props> = (props) => {
  const { handleBatchDelete } = props;
  const { state } = useStore();
  const { t } = useText();

  return (
    <div className="flex items-center gap-4">
      <h1 className="text-2xl font-bold bg-blue-500 bg-clip-text text-transparent">
        {t("header.title")}
      </h1>

      {state.selectionMode && state.selectedPhrases.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {t("header.selectedCount", {
              count: state.selectedPhrases.length,
            })}
          </span>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={handleBatchDelete}
          >
            {t("header.deleteSelected")}
          </Button>
        </div>
      )}
    </div>
  );
};
