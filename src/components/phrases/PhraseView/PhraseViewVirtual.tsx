import { Phrase } from "@/types";
import { PhraseCard } from "../PhraseCard/PhraseCard";
import { useStore } from "@/store";
import { VirtualList } from "@/components/common/VirtualList/VirtualList";

interface Props {
  filteredPhrases: Phrase[];
}

export const PhraseViewVirtual: React.FC<Props> = (props) => {
  const { filteredPhrases } = props;

  const { state } = useStore();

  return (
    <div className="animate-fade-in">
      <VirtualList
        items={filteredPhrases}
        itemHeight={200}
        containerHeight={600}
        renderItem={(phrase) => (
          <div className="p-2 h-full">
            <PhraseCard
              phrase={phrase}
              isSelected={state.selectedPhrases.includes(phrase.id)}
            />
          </div>
        )}
        className="border border-gray-200 dark:border-gray-700 rounded-lg"
      />
    </div>
  );
};
