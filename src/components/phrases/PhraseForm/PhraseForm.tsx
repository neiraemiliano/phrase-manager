import { toast } from "@/components/common/Toast/Toast";
import { useForm, usePhrases } from "@/hooks";
import {
  createNonEmptyString,
  PhraseFormValues,
  ValidationResult,
} from "@/types";
import { Button } from "@components/common/Button/Button";
import { useText } from "@contexts/TextContext";
import { combineClasses, utils } from "@/styles/design-system";
import {
  getCharacterCount,
  sanitizeInput,
  validatePhraseForm,
} from "@utils/validation";
import { AlertCircle, Plus } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { PhraseFormAuthor } from "./PhraseFormAuthor";
import { PhraseFormCategory } from "./PhraseFormCategory";
import { PhraseFormTags } from "./PhraseFormTags";
import { PhraseFormText } from "./PhraseFormText";

export const PhraseForm: React.FC = () => {
  const { t } = useText();
  const { createPhrase } = usePhrases();
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<PhraseFormValues>({
    text: "",
    tags: "",
    author: "",
    category: "",
  });

  const hasAttemptedSubmitRef = useRef(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const validation: ValidationResult = useMemo(() => {
    if (!showValidationErrors && Object.keys(form.touched).length === 0) {
      const hasMinimumText = form.values.text.trim().length >= 3;
      return {
        isValid: hasMinimumText,
        errors: [],
      };
    }

    return validatePhraseForm(form.values);
  }, [form.values, form.touched, showValidationErrors]);

  // Character counts for UI feedback
  const textCount = useMemo(
    () => getCharacterCount(form.values.text),
    [form.values.text],
  );
  const authorCount = useMemo(
    () => getCharacterCount(form.values.author),
    [form.values.author],
  );
  const categoryCount = useMemo(
    () => getCharacterCount(form.values.category),
    [form.values.category],
  );

  const handleSubmit = async (values: PhraseFormValues) => {
    hasAttemptedSubmitRef.current = true;
    setShowValidationErrors(true);

    try {
      // Re-validate before submission
      const finalValidation = validatePhraseForm(values);

      if (!finalValidation.isValid) {
        const firstError = finalValidation.errors[0];
        toast.error(`Validation failed: ${firstError.message}`);
        return;
      }

      // Type-safe phrase creation with sanitization
      const sanitizedText = sanitizeInput(values.text);
      const sanitizedAuthor = values.author
        ? sanitizeInput(values.author)
        : undefined;
      const sanitizedCategory = values.category
        ? sanitizeInput(values.category)
        : undefined;

      // Use the headless hook for creation - it handles ID generation automatically
      createPhrase({
        text: createNonEmptyString(sanitizedText),
        tags: values.tags
          .split(",")
          .map((tag) => sanitizeInput(tag))
          .filter(Boolean)
          .slice(0, 5), // Max 5 tags
        author: sanitizedAuthor
          ? createNonEmptyString(sanitizedAuthor)
          : undefined,
        category: sanitizedCategory
          ? createNonEmptyString(sanitizedCategory)
          : undefined,
      });

      // Reset form after successful submission
      form.resetForm();
      hasAttemptedSubmitRef.current = false;
      setShowValidationErrors(false);

      // Focus and select text in the input for next entry
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
          textInputRef.current.select();
        }
      }, 100);

      toast.success(t("messages.phraseAdded"));
    } catch (error) {
      console.error("Error creating phrase:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create phrase",
      );
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className={combineClasses(
        "space-y-4 sm:space-y-6",
        utils.responsive.paddingXMobile,
      )}
    >
      <div className="space-y-2">
        <PhraseFormText form={form} ref={textInputRef} />
        <div
          className={combineClasses(
            "flex flex-col sm:flex-row sm:justify-between sm:items-center",
            "text-sm gap-2 sm:gap-0",
          )}
        >
          <div className="flex items-center gap-2 text-gray-500 order-2 sm:order-1">
            <span className="text-xs sm:text-sm">
              {textCount}/500 {t("form.charactersLabel")}
            </span>
            {textCount > 450 && (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          {(showValidationErrors || form.touched.text) &&
            validation.errors.some((e) => e.field === "text") && (
              <div
                className={combineClasses(
                  "text-red-500 text-xs sm:text-sm order-1 sm:order-2",
                  "p-2 bg-red-50 dark:bg-red-900/20 rounded-md",
                  "border border-red-200 dark:border-red-800",
                )}
              >
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {validation.errors.find((e) => e.field === "text")?.message}
                  </span>
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="space-y-1">
          <PhraseFormTags form={form} />
          {(showValidationErrors || form.touched.tags) &&
            validation.errors.some((e) => e.field === "tags") && (
              <div
                className={combineClasses(
                  "text-red-500 text-xs",
                  "p-2 bg-red-50 dark:bg-red-900/20 rounded-md",
                  "border border-red-200 dark:border-red-800",
                )}
              >
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>
                    {validation.errors.find((e) => e.field === "tags")?.message}
                  </span>
                </div>
              </div>
            )}
        </div>

        <div className="space-y-1">
          <PhraseFormAuthor form={form} />
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>
              {authorCount}/50 {t("form.charactersLabel")}
            </span>
            {(showValidationErrors || form.touched.author) &&
              validation.errors.some((e) => e.field === "author") && (
                <div className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span className={utils.text.truncate}>
                    {
                      validation.errors.find((e) => e.field === "author")
                        ?.message
                    }
                  </span>
                </div>
              )}
          </div>
        </div>

        <div className="space-y-1">
          <PhraseFormCategory form={form} />
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>
              {categoryCount}/30 {t("form.charactersLabel")}
            </span>
            {(showValidationErrors || form.touched.category) &&
              validation.errors.some((e) => e.field === "category") && (
                <div className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span className={utils.text.truncate}>
                    {
                      validation.errors.find((e) => e.field === "category")
                        ?.message
                    }
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        {showValidationErrors &&
          !validation.isValid &&
          validation.errors.length > 0 && (
            <div
              id="form-validation-status"
              className={combineClasses(
                "text-red-500 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg",
                "border border-red-200 dark:border-red-800",
                "text-sm sm:text-base",
              )}
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  {t("form.validationErrors", {
                    count: validation.errors.length,
                  })}
                </span>
              </div>
            </div>
          )}

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={form.isSubmitting}
            disabled={!validation.isValid || form.isSubmitting}
            leftIcon={<Plus className="w-4 h-4" />}
            className={combineClasses(
              "w-full sm:w-auto sm:min-w-[140px]",
              utils.responsive.touchTarget, // Ensure touch-friendly on mobile
              "justify-center sm:justify-start",
            )}
            aria-describedby="form-validation-status"
          >
            {form.isSubmitting ? t("form.submitting") : t("form.submit")}
          </Button>

          {validation.isValid && !showValidationErrors && (
            <div className="hidden sm:block text-sm text-green-600 dark:text-green-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{t("form.readyToSubmit")}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
