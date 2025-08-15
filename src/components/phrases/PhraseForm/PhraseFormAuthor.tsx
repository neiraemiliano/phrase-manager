import { useText } from "@/contexts/TextContext";
import clsx from "clsx";

type Props = {
  form: any;
};

export const PhraseFormAuthor: React.FC<Props> = ({ form }) => {
  const { t } = useText();
  return (
    <div>
      <label
        htmlFor="author"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {t("form.fields.author")}
      </label>
      <input
        id="author"
        type="text"
        value={form.values.author}
        onChange={form.handleChange("author")}
        onBlur={form.handleBlur("author")}
        placeholder={t("form.placeholders.author")}
        className={clsx(
          "w-full px-3 py-2 rounded-lg border transition-colors",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-gray-100",
          "placeholder-gray-400 dark:placeholder-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          {
            "border-red-500": form.errors.author && form.touched.author,
            "border-gray-300 dark:border-gray-700": !(
              form.errors.author && form.touched.author
            ),
          }
        )}
      />
      {form.errors.author && form.touched.author && (
        <p className="text-red-500 text-xs mt-1">{form.errors.author}</p>
      )}
    </div>
  );
};
