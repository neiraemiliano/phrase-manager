import { Phrase } from "@/types";
import { PhraseCard } from "../PhraseCard/PhraseCard";
import { useStore } from "@/store";
import {
  componentSpacing,
  animations,
  combineClasses,
} from "@/styles/design-system";

interface Props {
  filteredPhrases: Phrase[];
}

export const PhraseViewGrid: React.FC<Props> = (props) => {
  const { filteredPhrases } = props;

  const { state } = useStore();

  return (
    <div className={componentSpacing.grid.cardGrid}>
      {filteredPhrases.map((phrase, index) => (
        <div
          key={phrase.id}
          className={combineClasses(
            animations.fade.in,
            "animate-in duration-200",
          )}
          style={{
            animationDelay: `${Math.min(index * 50, 300)}ms`,
          }}
        >
          <PhraseCard
            phrase={phrase}
            isSelected={state.selectedPhrases.includes(phrase.id)}
          />
        </div>
      ))}
    </div>
  );
};
