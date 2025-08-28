import { useText } from "@/contexts/TextContext";
import { LIMITS } from "@/utils";
import { combineClasses, utils } from "@/styles/design-system";
import React from "react";

type Props = {
  form: any;
};

export const PhraseFormText = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ form }, ref) => {
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
          ref={ref}
          id="text"
          name="text"
          rows={3}
          value={form.values.text}
          onChange={form.handleChange("text")}
          onBlur={form.handleBlur("text")}
          placeholder={t("form.placeholders.text")}
          aria-describedby={
            form.errors.text && form.touched.text
              ? "text-error text-help"
              : "text-help"
          }
          aria-required="true"
          aria-invalid={!!(form.errors.text && form.touched.text)}
          className={combineClasses(
            "w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border transition-colors",
            "bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-gray-100 text-sm sm:text-base",
            "placeholder-gray-400 dark:placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            "resize-none", // Prevent textarea resize on mobile
            utils.responsive.touchTarget, // Touch-friendly sizing
            form.errors.text && form.touched.text
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-700 focus:border-blue-500",
          )}
        />
        <div className="flex justify-between items-center mt-1">
          {form.errors.text && form.touched.text && (
            <p
              id="text-error"
              className="text-red-500 text-sm"
              role="alert"
              aria-live="polite"
            >
              {form.errors.text}
            </p>
          )}
          <span
            id="text-help"
            className="text-xs text-gray-500 dark:text-gray-400 ml-auto"
            aria-label={`Character count: ${form.values.text.length} of ${LIMITS.MAX_PHRASE_LENGTH} characters`}
          >
            {t("form.characterCount", {
              current: form.values.text.length,
              max: LIMITS.MAX_PHRASE_LENGTH,
            })}
          </span>
        </div>
      </div>
    );
  },
);

PhraseFormText.displayName = "PhraseFormText";
