import { ViewMode } from "@/types";
import { HeaderExportImport } from "./HeaderExportImport";
import { HeaderLanguageToggle } from "./HeaderLanguageToggle";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderSelectionToggle } from "./HeaderSelectionToggle";
import { HeaderThemeToggle } from "./HeaderThemeToggle";
import { HeaderViewModeSelector } from "./HeaderViewModeSelector";

type Props = {
  handleBatchDelete: () => void;
  handleLanguageToggle: () => void;
  handleViewModeChange: (m: ViewMode) => void;
  handleImport: (file: React.ChangeEvent<HTMLInputElement>) => void;
  handleExport: () => void;
  handleImportClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleThemeToggle: () => void;
};

export const HeaderBar: React.FC<Props> = (props) => {
  const {
    handleBatchDelete,
    handleLanguageToggle,
    handleViewModeChange,
    handleImport,
    handleExport,
    handleImportClick,
    fileInputRef,
    handleThemeToggle,
  } = props;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <HeaderLogo handleBatchDelete={handleBatchDelete} />
          <div className="flex items-center gap-2">
            <HeaderLanguageToggle handle={handleLanguageToggle} />
            <HeaderViewModeSelector handle={handleViewModeChange} />
            <HeaderSelectionToggle />
            <HeaderExportImport
              handleExport={handleExport}
              handleImportClick={handleImportClick}
              fileInputRef={fileInputRef}
              handleImport={handleImport}
            />
            <HeaderThemeToggle handle={handleThemeToggle} />
          </div>
        </div>
      </div>
    </header>
  );
};
