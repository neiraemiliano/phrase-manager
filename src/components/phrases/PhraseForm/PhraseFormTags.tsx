import { useText } from "@/contexts/TextContext";
import clsx from "clsx";

type Props = {
  form: any;
};

export const PhraseFormTags: React.FC<Props> = ({ form }) => {
  const { t } = useText();

  return (
    <div>
      <label
        htmlFor="tags"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {t("form.fields.tags")}
      </label>
      <input
        id="tags"
        type="text"
        value={form.values.tags}
        onChange={form.handleChange("tags")}
        onBlur={form.handleBlur("tags")}
        placeholder={t("form.placeholders.tags")}
        className={clsx(
          "w-full px-3 py-2 rounded-lg border transition-colors",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-gray-100",
          "placeholder-gray-400 dark:placeholder-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          {
            "border-red-500": form.errors.tags && form.touched.tags,
            "border-gray-300 dark:border-gray-700": !(
              form.errors.tags && form.touched.tags
            ),
          }
        )}
      />
      {form.errors.tags && form.touched.tags && (
        <p className="text-red-500 text-xs mt-1">{form.errors.tags}</p>
      )}
    </div>
  );
};
