import { Phrase, PhraseFormValues } from "@/types";
import { Button } from "@components/common/Button/Button";
import { useText } from "@contexts/TextContext";
import { useForm } from "@hooks/useForm";
import { LIMITS } from "@utils/constants";
import { generateId } from "@utils/generators";
import { validators } from "@utils/validators";
import { Plus } from "lucide-react";
import React from "react";
import { PhraseFormAuthor } from "./PhraseFormAuthor";
import { PhraseFormCategory } from "./PhraseFormCategory";
import { PhraseFormTags } from "./PhraseFormTags";
import { PhraseFormText } from "./PhraseFormText";
import { actions, useStore } from "@/store";
import { toast } from "@/components/common/Toast/Toast";

export const PhraseForm: React.FC = () => {
  const { t } = useText();
  const { dispatch } = useStore();

  const form = useForm<PhraseFormValues>(
    {
      text: "",
      tags: "",
      author: "",
      category: "",
    },
    {
      text: validators.compose(
        validators.required(t("form.validation.textRequired")),
        validators.minLength(
          LIMITS.MIN_PHRASE_LENGTH,
          t("form.validation.textTooShort", { min: LIMITS.MIN_PHRASE_LENGTH })
        ),
        validators.maxLength(
          LIMITS.MAX_PHRASE_LENGTH,
          t("form.validation.textTooLong", { max: LIMITS.MAX_PHRASE_LENGTH })
        )
      ),
      tags: validators.pattern(
        /^[\w\s,áéíóúñ]*$/,
        t("form.validation.invalidTags")
      ),
      author: validators.compose(
        validators.minLength(2, t("form.validation.authorTooShort")),
        validators.maxLength(50, t("form.validation.authorTooLong"))
      ),
    }
  );

  const handleSubmit = (values: PhraseFormValues) => {
    const newPhrase: Phrase = {
      id: generateId(),
      text: values.text.trim(),
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, LIMITS.MAX_TAGS),
      author: values.author.trim() || undefined,
      category: values.category || undefined,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    dispatch(actions.addPhrase(newPhrase));
    toast.success(t("messages.phraseAdded"));
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mx-1">
      <PhraseFormText form={form} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PhraseFormTags form={form} />
        <PhraseFormAuthor form={form} />
        <PhraseFormCategory form={form} />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={form.isSubmitting}
        leftIcon={<Plus className="w-4 h-4" />}
        className="w-full md:w-auto"
      >
        {form.isSubmitting ? t("form.submitting") : t("form.submit")}
      </Button>
    </form>
  );
};
