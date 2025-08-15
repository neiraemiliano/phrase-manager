import { Button } from "@/components/common/Button/Button";
import { useText } from "@/contexts/TextContext";
import React from "react";
import { useNavigate } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  const { t } = useText();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center">
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h1
            className={`text-[150px] font-bold bg-blue-500  bg-clip-text text-transparent transition-transform duration-300 ${
              isHovered ? "scale-150" : "scale-100"
            }`}
          >
            404
          </h1>

          <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400 rounded-full opacity-50 animate-bounce" />
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-400 rounded-full opacity-50 animate-ping" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-2">
          {t("notFound.title")}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {t("notFound.description")}
        </p>

        <div className="space-x-4">
          <Button
            onClick={() => navigate("/")}
            className="px-8 py-3  text-white font-medium rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            {t("notFound.goHome")}
          </Button>
        </div>
      </div>
    </div>
  );
};
