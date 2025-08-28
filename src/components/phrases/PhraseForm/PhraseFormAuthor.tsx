import { useText } from "@/contexts/TextContext";
import { combineClasses, utils } from "@/styles/design-system";

type Props = {
  form: any;
};

export const PhraseFormAuthor: React.FC<Props> = ({ form }) => {
  const { t } = useText();
  return (
    <div>
      <label
        htmlFor="author"
        className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {t("form.fields.author")}
      </label>
      <input
        id="author"
        name="author"
        type="text"
        value={form.values.author}
        onChange={form.handleChange("author")}
        onBlur={form.handleBlur("author")}
        placeholder={t("form.placeholders.author")}
        aria-describedby={
          form.errors.author && form.touched.author ? "author-error" : undefined
        }
        aria-invalid={!!(form.errors.author && form.touched.author)}
        className={combineClasses(
          "w-full px-3 py-2 rounded-lg border transition-colors",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-gray-100 text-sm sm:text-base",
          "placeholder-gray-400 dark:placeholder-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          utils.responsive.touchTarget,
          form.errors.author && form.touched.author
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 dark:border-gray-700 focus:border-blue-500",
        )}
      />
      {form.errors.author && form.touched.author && (
        <p
          id="author-error"
          className="text-red-500 text-xs mt-1"
          role="alert"
          aria-live="polite"
        >
          {form.errors.author}
        </p>
      )}
    </div>
  );
};
