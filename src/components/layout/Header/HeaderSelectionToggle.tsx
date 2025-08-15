import { Button } from "@/components/common/Button/Button";
import { useText } from "@/contexts/TextContext";
import { actions, useStore } from "@/store";
import { COLOR_VARIANT } from "@/utils";
import { Filter } from "lucide-react";

export const HeaderSelectionToggle: React.FC = () => {
  const { state, dispatch } = useStore();
  const { t } = useText();
  return (
    <Button
      variant={
        state.selectionMode ? COLOR_VARIANT.PRIMARY : COLOR_VARIANT.GHOST
      }
      size="sm"
      leftIcon={<Filter className="w-4 h-4" />}
      onClick={() => dispatch(actions.toggleSelectionMode())}
    >
      {t("header.selection")}
    </Button>
  );
};
