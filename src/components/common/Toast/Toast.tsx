import { combineClasses } from "@/styles/design-system";
import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

let toastListener: ((toast: ToastMessage) => void) | null = null;

export const toast = {
  success: (message: string, duration = 3000) => {
    const toastMessage: ToastMessage = {
      id: Date.now().toString(),
      type: "success",
      message,
      duration,
    };
    toastListener?.(toastMessage);
  },
  error: (message: string, duration = 5000) => {
    const toastMessage: ToastMessage = {
      id: Date.now().toString(),
      type: "error",
      message,
      duration,
    };
    toastListener?.(toastMessage);
  },
  info: (message: string, duration = 3000) => {
    const toastMessage: ToastMessage = {
      id: Date.now().toString(),
      type: "info",
      message,
      duration,
    };
    toastListener?.(toastMessage);
  },
  warning: (message: string, duration = 4000) => {
    const toastMessage: ToastMessage = {
      id: Date.now().toString(),
      type: "warning",
      message,
      duration,
    };
    toastListener?.(toastMessage);
  },
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastListener = (toast) => {
      setToasts((prev) => [...prev, toast]);

      if (toast.duration) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, toast.duration);
      }
    };

    return () => {
      toastListener = null;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  };

  const colors = {
    success:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    warning:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={combineClasses(
            "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg",
            "animate-slide-up min-w-[300px] max-w-[500px]",
            colors[toast.type],
          )}
        >
          {icons[toast.type]}
          <p className="flex-1 text-sm text-gray-900 dark:text-gray-100">
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
