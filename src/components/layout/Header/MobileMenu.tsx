import { ViewMode } from "@/types";
import {
  buttons,
  animations,
  colors,
  combineClasses,
} from "@/styles/design-system";
import { HeaderLanguageToggle } from "./HeaderLanguageToggle";
import { HeaderViewModeSelector } from "./HeaderViewModeSelector";
import { HeaderSelectionToggle } from "./HeaderSelectionToggle";
import { HeaderExportImport } from "./HeaderExportImport";
import { HeaderThemeToggle } from "./HeaderThemeToggle";
import { ConfirmDialog } from "@/components/common/ConfirmDialog/ConfirmDialog";
import { useText } from "@/contexts/TextContext";
import { useStore } from "@/store";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleBatchDelete: () => void;
  handleLanguageToggle: () => void;
  handleViewModeChange: (m: ViewMode) => void;
  handleImport: (file: React.ChangeEvent<HTMLInputElement>) => void;
  handleExport: () => void;
  handleImportClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleThemeToggle: () => void;
}

export const MobileMenu: React.FC<Props> = ({
  isOpen,
  onClose,
  handleBatchDelete,
  handleLanguageToggle,
  handleViewModeChange,
  handleImport,
  handleExport,
  handleImportClick,
  fileInputRef,
  handleThemeToggle,
}) => {
  const { t } = useText();
  const { state } = useStore();
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);

  // Mobile-only view modes (no grid)
  const handleMobileViewModeChange = (mode: ViewMode) => {
    // Filter out grid mode for mobile
    if (mode !== "grid") {
      handleViewModeChange(mode);
    }
  };

  const handleBatchDeleteClick = () => {
    setShowBatchDeleteConfirm(true);
  };

  const handleConfirmBatchDelete = () => {
    handleBatchDelete();
    setShowBatchDeleteConfirm(false);
    onClose();
  };

  const handleCancelBatchDelete = () => {
    setShowBatchDeleteConfirm(false);
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className={combineClasses(
          "fixed inset-0 bg-black/50 z-40",
          "backdrop-blur-sm",
          animations.transition.fast,
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={combineClasses(
          "fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50",
          "bg-white dark:bg-gray-900",
          "border-l border-gray-200 dark:border-gray-800",
          "shadow-xl",
          animations.transition.normal,
          "transform",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2
            id="mobile-menu-title"
            className={combineClasses(
              "text-lg font-semibold",
              colors.text.primary,
            )}
          >
            {t("menu.title")}
          </h2>
          <button
            onClick={onClose}
            className={combineClasses(
              buttons.base,
              buttons.variants.ghost,
              buttons.sizes.sm,
              "p-2 rounded-lg",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              animations.transition.fast,
            )}
            aria-label={t("menu.close")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-6">
          <div className="flex items-center justify-between">
            <span
              className={combineClasses(
                "text-sm font-medium",
                colors.text.primary,
              )}
            >
              {t("menu.sections.theme")}
            </span>
            <HeaderThemeToggle handle={handleThemeToggle} />
          </div>

          <div className="flex items-center justify-between">
            <span
              className={combineClasses(
                "text-sm font-medium",
                colors.text.primary,
              )}
            >
              {t("menu.sections.language")}
            </span>
            <HeaderLanguageToggle handle={handleLanguageToggle} />
          </div>

          <div className="flex items-center justify-between">
            <span
              className={combineClasses(
                "text-sm font-medium",
                colors.text.primary,
              )}
            >
              {t("menu.sections.viewMode")}
            </span>
            <HeaderViewModeSelector
              handle={handleMobileViewModeChange}
              mobileOnly={true}
            />
          </div>

          <div className="flex items-center justify-between">
            <span
              className={combineClasses(
                "text-sm font-medium",
                colors.text.primary,
              )}
            >
              {t("menu.sections.selection")}
            </span>
            <HeaderSelectionToggle />
          </div>

          <div className="flex flex-col space-y-3">
            <span
              className={combineClasses(
                "text-sm font-medium",
                colors.text.primary,
              )}
            >
              {t("menu.sections.dataManagement")}
            </span>
            <HeaderExportImport
              handleExport={handleExport}
              handleImportClick={handleImportClick}
              fileInputRef={fileInputRef}
              handleImport={handleImport}
            />
          </div>

          {state.selectionMode && state.selectedPhrases.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={handleBatchDeleteClick}
                className={combineClasses(
                  buttons.base,
                  buttons.variants.danger,
                  buttons.sizes.md,
                  "w-full justify-center",
                )}
              >
                {t("menu.batchDelete.button", {
                  count: state.selectedPhrases.length,
                })}
              </button>
            </div>
          )}
        </div>

        <ConfirmDialog
          isOpen={showBatchDeleteConfirm}
          onClose={handleCancelBatchDelete}
          onConfirm={handleConfirmBatchDelete}
          title={t("menu.batchDelete.title")}
          message={t("menu.batchDelete.message", {
            count: state.selectedPhrases.length,
          })}
          confirmText={t("menu.batchDelete.confirm")}
          cancelText={t("menu.batchDelete.cancel")}
          variant="danger"
        />
      </div>
    </>
  );
};
