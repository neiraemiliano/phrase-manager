import { Button } from "@/components/common/Button/Button";
import { useText } from "@/contexts/TextContext";
import { Download, Upload } from "lucide-react";
import React from "react";

type Props = {
  handleExport: () => void;
  handleImportClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImport: (file: React.ChangeEvent<HTMLInputElement>) => void;
};

export const HeaderExportImport: React.FC<Props> = (props) => {
  const { handleExport, handleImportClick, fileInputRef, handleImport } = props;
  const { t } = useText();
  return (
    <React.Fragment>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<Download className="w-4 h-4" />}
        onClick={handleExport}
      >
        {t("header.export")}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        leftIcon={<Upload className="w-4 h-4" />}
        onClick={handleImportClick}
      >
        {t("header.import")}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </React.Fragment>
  );
};
