import { useText } from "@/contexts/TextContext";
import { LIMITS } from "@/utils";
import clsx from "clsx";

type Props = {
  form: any;
};

export const PhraseFormText: React.FC<Props> = ({ form }) => {
  const { t } = useText();
  return (
    <div>
      <label
        htmlFor="text"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {t("form.fields.text")} *
      </label>
      <textarea
        id="text"
        rows={3}
        value={form.values.text}
        onChange={form.handleChange("text")}
        onBlur={form.handleBlur("text")}
        placeholder={t("form.placeholders.text")}
        className={clsx(
          "w-full px-4 py-3 rounded-lg border transition-colors",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-gray-100",
          "placeholder-gray-400 dark:placeholder-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          {
            "border-red-500": form.errors.text && form.touched.text,
            "border-gray-300 dark:border-gray-700": !(
              form.errors.text && form.touched.text
            ),
          }
        )}
      />
      <div className="flex justify-between items-center mt-1">
        {form.errors.text && form.touched.text && (
          <p className="text-red-500 text-sm">{form.errors.text}</p>
        )}
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
          {t("form.characterCount", {
            current: form.values.text.length,
            max: LIMITS.MAX_PHRASE_LENGTH,
          })}
        </span>
      </div>
    </div>
  );
};
