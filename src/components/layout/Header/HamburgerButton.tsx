import { buttons, animations, combineClasses } from "@/styles/design-system";
import { useText } from "@/contexts/TextContext";

interface Props {
  isOpen: boolean;
  onClick: () => void;
}

export const HamburgerButton: React.FC<Props> = ({ isOpen, onClick }) => {
  const { t } = useText();

  return (
    <button
      onClick={onClick}
      className={combineClasses(
        buttons.base,
        buttons.variants.ghost,
        buttons.sizes.md,
        "p-2 rounded-lg",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "focus:ring-2 focus:ring-purple-500/20",
        "md:hidden", // Only show on mobile
        animations.transition.fast,
      )}
      aria-label={isOpen ? t("menu.close") : t("menu.open")}
      aria-expanded={isOpen}
    >
      <div className="relative w-6 h-6">
        <span
          className={combineClasses(
            "absolute block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out",
            isOpen ? "rotate-45 translate-y-2" : "translate-y-0",
          )}
        />
        <span
          className={combineClasses(
            "absolute block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out",
            "translate-y-2",
            isOpen ? "opacity-0" : "opacity-100",
          )}
        />
        <span
          className={combineClasses(
            "absolute block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out",
            isOpen ? "-rotate-45 translate-y-2" : "translate-y-4",
          )}
        />
      </div>
    </button>
  );
};
