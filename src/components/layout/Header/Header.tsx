import { useStore } from "@/store";
import { Locale, ViewMode } from "@/types";
import { LOCALE } from "@/utils";
import { useText } from "@contexts/TextContext";
import { ExportService } from "@services/export.service";
import { actions } from "@store/actions";
import React, { useState } from "react";
import { HeaderBar } from "./HeaderBar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog/ConfirmDialog";

export const Header: React.FC = () => {
  const { state, dispatch } = useStore();
  const { locale, setLocale, t } = useText();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);

  const handleThemeToggle = () => {
    dispatch(actions.toggleTheme());
  };

  const handleLanguageToggle = () => {
    setLocale((locale === LOCALE.EN ? LOCALE.ES : LOCALE.EN) as Locale);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    dispatch(actions.setViewMode(mode));
  };

  const handleExport = () => {
    ExportService.exportToJSON(state.phrases);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const phrases = await ExportService.importFromJSON(file);
        dispatch(actions.importPhrases(phrases));
      } catch (error) {
        console.error("Error importing phrases:", error);
      }
    }
    e.target.value = "";
  };

  const handleBatchDelete = () => {
    if (state.selectedPhrases.length > 0) {
      setShowBatchDeleteConfirm(true);
    }
  };

  const handleConfirmBatchDelete = () => {
    dispatch(actions.batchDelete(state.selectedPhrases));
    setShowBatchDeleteConfirm(false);
  };

  const handleCancelBatchDelete = () => {
    setShowBatchDeleteConfirm(false);
  };

  return (
    <>
      <HeaderBar
        handleBatchDelete={handleBatchDelete}
        handleLanguageToggle={handleLanguageToggle}
        handleViewModeChange={handleViewModeChange}
        handleImport={handleImport}
        handleExport={handleExport}
        handleImportClick={handleImportClick}
        fileInputRef={fileInputRef}
        handleThemeToggle={handleThemeToggle}
      />
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
    </>
  );
};
