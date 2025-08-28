import React, { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useFocusManagement } from "@/hooks";
import {
  buttons,
  cards,
  typography,
  colors,
  animations,
  combineClasses,
} from "@/styles/design-system";
import { useText } from "@/contexts/TextContext";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  const { t } = useText();
  const { saveFocus, restoreFocus } = useFocusManagement();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      saveFocus();
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 100);
    } else {
      restoreFocus();
    }
  }, [isOpen, saveFocus, restoreFocus]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Tab") {
        const focusableElements = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getVariantClasses = (variant: "danger" | "warning" | "info") => {
    const variantMap = {
      danger: {
        icon: "text-red-600 dark:text-red-400",
        button: buttons.variants.danger,
        iconBg: "bg-red-100 dark:bg-red-900/30",
      },
      warning: {
        icon: "text-yellow-600 dark:text-yellow-400",
        button: buttons.variants.warning,
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      },
      info: {
        icon: "text-blue-600 dark:text-blue-400",
        button: combineClasses(
          buttons.base,
          buttons.sizes.md,
          "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        ),
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
      },
    };
    return variantMap[variant];
  };

  const variantClasses = getVariantClasses(variant);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={combineClasses(
          "fixed inset-0 bg-black bg-opacity-50",
          animations.transition.normal,
        )}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          ref={dialogRef}
          className={combineClasses(
            "relative transform overflow-hidden rounded-lg shadow-xl",
            cards.base,
            cards.sizes.md,
            animations.transition.normal,
            "sm:my-8 sm:w-full sm:max-w-lg",
          )}
        >
          <button
            onClick={onClose}
            className={combineClasses(
              "absolute right-4 top-4 rounded-md p-1",
              colors.text.secondary,
              "hover:text-gray-500 dark:hover:text-gray-300",
              "focus:outline-none focus:ring-2 focus:ring-purple-500",
            )}
            aria-label={t("common.closeDialog")}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="sm:flex sm:items-start">
            <div
              className={combineClasses(
                "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full",
                "sm:mx-0 sm:h-10 sm:w-10",
                variantClasses.iconBg,
              )}
            >
              <AlertTriangle
                className={combineClasses("h-6 w-6", variantClasses.icon)}
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3
                id="dialog-title"
                className={combineClasses(
                  typography.heading.h4,
                  colors.text.primary,
                )}
              >
                {title}
              </h3>
              <div className="mt-2">
                <p
                  id="dialog-description"
                  className={combineClasses(
                    typography.body.sm,
                    colors.text.secondary,
                  )}
                >
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:space-x-3 sm:space-x-reverse space-y-3 sm:space-y-0">
            <button
              ref={confirmButtonRef}
              onClick={handleConfirm}
              className={combineClasses(
                buttons.base,
                buttons.sizes.md,
                variantClasses.button,
                "w-full sm:w-auto",
              )}
            >
              {confirmText}
            </button>
            <button
              ref={cancelButtonRef}
              onClick={onClose}
              className={combineClasses(
                buttons.base,
                buttons.sizes.md,
                buttons.variants.outline,
                "w-full sm:w-auto",
              )}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
