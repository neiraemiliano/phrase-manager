import { Phrase } from "@/types";
import { PhraseCard } from "../PhraseCard/PhraseCard";
import { useStore } from "@/store";

interface Props {
  filteredPhrases: Phrase[];
}

export const PhraseViewList: React.FC<Props> = (props) => {
  const { filteredPhrases } = props;

  const { state } = useStore();

  return (
    <div className="space-y-4 animate-fade-in">
      {filteredPhrases.map((phrase) => (
        <PhraseCard
          key={phrase.id}
          phrase={phrase}
          isSelected={state.selectedPhrases.includes(phrase.id)}
        />
      ))}
    </div>
  );
};
