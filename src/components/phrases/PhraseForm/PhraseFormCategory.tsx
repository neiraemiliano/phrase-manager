import { useText } from "@/contexts/TextContext";
import { combineClasses, utils } from "@/styles/design-system";

type Props = {
  form: any;
};

export const PhraseFormCategory: React.FC<Props> = ({ form }) => {
  const { t } = useText();
  const categories = [
    { value: "technology", label: t("phrases.categories.technology") },
    { value: "philosophy", label: t("phrases.categories.philosophy") },
    { value: "bestPractices", label: t("phrases.categories.bestPractices") },
    { value: "architecture", label: t("phrases.categories.architecture") },
    { value: "testing", label: t("phrases.categories.testing") },
    { value: "design", label: t("phrases.categories.design") },
    { value: "methodology", label: t("phrases.categories.methodology") },
  ];
  return (
    <div>
      <label
        htmlFor="category"
        className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {t("form.fields.category")}
      </label>
      <select
        id="category"
        value={form.values.category}
        onChange={form.handleChange("category")}
        className={combineClasses(
          "w-full px-3 py-2 rounded-lg border transition-colors",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-gray-100 text-sm sm:text-base",
          "border-gray-300 dark:border-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          utils.responsive.touchTarget,
          "appearance-none cursor-pointer", // Better mobile experience
        )}
      >
        <option value="">{t("form.placeholders.category")}</option>
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  );
};
