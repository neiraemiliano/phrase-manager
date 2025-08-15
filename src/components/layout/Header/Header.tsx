import { useStore } from "@/store";
import { Locale, ViewMode } from "@/types";
import { LOCALE } from "@/utils";
import { useText } from "@contexts/TextContext";
import { ExportService } from "@services/export.service";
import { actions } from "@store/actions";
import React from "react";
import { HeaderBar } from "./HeaderBar";

export const Header: React.FC = () => {
  const { state, dispatch } = useStore();
  const { locale, setLocale } = useText();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
      const confirmed = window.confirm(
        `¿Eliminar ${state.selectedPhrases.length} frases seleccionadas?`
      );
      if (confirmed) {
        dispatch(actions.batchDelete(state.selectedPhrases));
      }
    }
  };

  return (
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
  );
};
