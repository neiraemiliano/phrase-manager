import { useText } from "@/contexts/TextContext";
import { Size, Variant } from "@/types";
import { buttons, animations, combineClasses } from "@/styles/design-system";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const { t } = useText();

  const getDesignSystemVariant = (variant: Variant) => {
    const variantMap = {
      primary: buttons.variants.primary,
      secondary: buttons.variants.secondary,
      danger: buttons.variants.danger,
      ghost: buttons.variants.ghost,
    };
    return variantMap[variant] || buttons.variants.primary;
  };

  const getDesignSystemSize = (size: Size) => {
    const sizeMap = {
      sm: buttons.sizes.sm,
      md: buttons.sizes.md,
      lg: buttons.sizes.lg,
    };
    return sizeMap[size] || buttons.sizes.md;
  };

  return (
    <button
      className={combineClasses(
        buttons.base,
        getDesignSystemVariant(variant),
        getDesignSystemSize(size),
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className={combineClasses(animations.loading, "h-4 w-4")}
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>{t("common.loading")}</span>
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};
