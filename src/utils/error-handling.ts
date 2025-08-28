import { NonEmptyString, createNonEmptyString } from "@/types";

// Error types for better error categorization
export type ErrorCategory =
  | "VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "STORAGE_ERROR"
  | "PARSING_ERROR"
  | "UNKNOWN_ERROR";

export interface AppError {
  readonly category: ErrorCategory;
  readonly message: NonEmptyString;
  readonly code?: string;
  readonly originalError?: Error;
  readonly timestamp: Date;
}

// Error factory with type safety
export const createAppError = (
  category: ErrorCategory,
  message: string,
  code?: string,
  originalError?: Error,
): AppError => ({
  category,
  message: createNonEmptyString(message),
  code,
  originalError,
  timestamp: new Date(),
});

// Type guard for AppError
export const isAppError = (error: unknown): error is AppError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "category" in error &&
    "message" in error &&
    "timestamp" in error
  );
};

// Generic async error handler with proper typing
export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  errorCategory: ErrorCategory = "UNKNOWN_ERROR",
  fallbackMessage = "An unexpected error occurred",
): Promise<{ data?: T; error?: AppError }> => {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    console.error(`${errorCategory}:`, error);

    const appError = createAppError(
      errorCategory,
      error instanceof Error ? error.message : fallbackMessage,
      error instanceof Error ? error.name : undefined,
      error instanceof Error ? error : undefined,
    );

    return { error: appError };
  }
};

// Synchronous operation error handler
export const handleSyncOperation = <T>(
  operation: () => T,
  errorCategory: ErrorCategory = "UNKNOWN_ERROR",
  fallbackMessage = "An unexpected error occurred",
): { data?: T; error?: AppError } => {
  try {
    const data = operation();
    return { data };
  } catch (error) {
    console.error(`${errorCategory}:`, error);

    const appError = createAppError(
      errorCategory,
      error instanceof Error ? error.message : fallbackMessage,
      error instanceof Error ? error.name : undefined,
      error instanceof Error ? error : undefined,
    );

    return { error: appError };
  }
};

// Error formatting for user display
export const formatErrorForUser = (error: AppError): string => {
  switch (error.category) {
    case "VALIDATION_ERROR":
      return error.message;
    case "NETWORK_ERROR":
      return "Network connection failed. Please check your internet connection.";
    case "STORAGE_ERROR":
      return "Failed to save data. Please try again.";
    case "PARSING_ERROR":
      return "Failed to process data. The file may be corrupted.";
    default:
      return "Something went wrong. Please try again.";
  }
};

// Error reporting utility (for future analytics/monitoring)
export const reportError = (error: AppError): void => {
  // In a real app, this would send to error tracking service
  console.group("Error Report");
  console.log("Category:", error.category);
  console.log("Message:", error.message);
  console.log("Code:", error.code);
  console.log("Timestamp:", error.timestamp);
  if (error.originalError) {
    console.log("Original Error:", error.originalError);
    console.log("Stack:", error.originalError.stack);
  }
  console.groupEnd();
};

// Retry mechanism with exponential backoff
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  maxDelay = 5000,
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");

      if (attempt === maxRetries) {
        break;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};
