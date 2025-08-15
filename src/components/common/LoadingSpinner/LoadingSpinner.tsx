import { useText } from "@/contexts/TextContext";

export const LoadingSpinner = () => {
  const { t } = useText();

  return (
    <div className="text-center py-4">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        {t("common.loading")}
      </p>
    </div>
  );
};
