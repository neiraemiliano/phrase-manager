import { PhraseControls } from "@/components/phrases/PhraseControls/PhraseControls";
import { PhraseSearchBar } from "@/components/phrases/PhraseSearchBar/PhraseSearchBar";

export const FilterSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <PhraseSearchBar />
        </div>
        <PhraseControls />
      </div>
    </div>
  );
};
