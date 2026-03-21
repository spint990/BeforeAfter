/**
 * Safe error logging utility for serverless environments
 * Prevents crashes when logging complex Prisma errors that may contain
 * circular references or non-serializable properties
 */

interface ErrorInfo {
  message: string;
  name: string;
  stack?: string;
  code?: string;
  meta?: unknown;
  cause?: unknown;
}

/**
 * Safely extracts error information without triggering getters
 * that might throw or cause serialization issues
 */
export function safeErrorInfo(error: unknown): ErrorInfo {
  if (error === null || error === undefined) {
    return {
      message: String(error),
      name: "UnknownError",
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
      name: "StringError",
    };
  }

  if (typeof error === "number" || typeof error === "boolean") {
    return {
      message: String(error),
      name: "PrimitiveError",
    };
  }

  if (typeof error === "object") {
    const errorObj = error as Record<string, unknown>;
    
    // Try to extract standard error properties safely
    const info: ErrorInfo = {
      message: "Unknown error",
      name: "ObjectError",
    };

    // Safe property extraction
    try {
      if ("message" in errorObj && typeof errorObj.message === "string") {
        info.message = errorObj.message;
      }
    } catch {
      info.message = "[Unable to read message]";
    }

    try {
      if ("name" in errorObj && typeof errorObj.name === "string") {
        info.name = errorObj.name;
      }
    } catch {
      // Keep default
    }

    try {
      if ("stack" in errorObj && typeof errorObj.stack === "string") {
        info.stack = errorObj.stack;
      }
    } catch {
      // Stack is optional
    }

    // Prisma-specific error properties
    try {
      if ("code" in errorObj) {
        info.code = String(errorObj.code);
      }
    } catch {
      // Code is optional
    }

    try {
      if ("meta" in errorObj) {
        // Try to safely serialize meta
        info.meta = JSON.parse(JSON.stringify(errorObj.meta));
      }
    } catch {
      info.meta = "[Unable to serialize meta]";
    }

    try {
      if ("cause" in errorObj) {
        info.cause = safeErrorInfo(errorObj.cause);
      }
    } catch {
      // Cause is optional
    }

    return info;
  }

  return {
    message: String(error),
    name: "UnknownError",
  };
}

/**
 * Safely logs an error to console.error without crashing
 * Use this instead of console.error("message:", error) in API routes
 */
export function logError(prefix: string, error: unknown): void {
  try {
    const info = safeErrorInfo(error);
    console.error(`${prefix}`, JSON.stringify(info, null, 2));
  } catch {
    // Last resort fallback
    console.error(`${prefix} [Error serialization failed]`);
  }
}

/**
 * Creates a user-friendly error response for API routes
 */
export function createErrorResponse(error: unknown, fallbackMessage: string): { error: string; details?: unknown } {
  const info = safeErrorInfo(error);
  
  // Don't expose internal error details in production
  if (process.env.NODE_ENV === "production") {
    return { error: fallbackMessage };
  }
  
  return {
    error: info.message || fallbackMessage,
    details: {
      name: info.name,
      code: info.code,
      message: info.message,
    },
  };
}
