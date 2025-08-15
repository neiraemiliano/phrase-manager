import { useStore } from "@store/StoreContext";
import { selectStats } from "@store/selectors";
import { Hash, Filter, CheckSquare, Type, Tag, User } from "lucide-react";
import { useText } from "@/contexts/TextContext";
import { PhraseStats } from "@/components/phrases/PhraseStats/PhraseStats";

export const StatsSection: React.FC = () => {
  const { state } = useStore();
  const { t } = useText();
  const stats = selectStats(state);

  const statItems = [
    {
      label: t("stats.total"),
      value: stats.total,
      icon: Hash,
      color: "blue" as const,
    },
    {
      label: t("stats.filtered"),
      value: stats.filtered,
      icon: Filter,
      color: "purple" as const,
    },
    {
      label: t("stats.selected"),
      value: stats.selected,
      icon: CheckSquare,
      color: "green" as const,
    },
    {
      label: t("stats.avgLength"),
      value: stats.avgLength,
      icon: Type,
      color: "yellow" as const,
    },
    {
      label: t("stats.tags"),
      value: stats.totalTags,
      icon: Tag,
      color: "pink" as const,
    },
    {
      label: t("stats.authors"),
      value: stats.authors,
      icon: User,
      color: "indigo" as const,
    },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item, index) => (
        <PhraseStats key={index} {...item} animationDelay={index * 100} />
      ))}
    </div>
  );
};
