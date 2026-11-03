import { NextResponse } from "next/server";

/** An expected error that can safely be returned to an API client. */
export class HttpError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = "INTERNAL_SERVER_ERROR",
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad request", details?: unknown) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Authentication is required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "You do not have permission to do this") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT");
  }
}

export type ApiHandler<Context = unknown> = (
  request: Request,
  context: Context,
) => Response | Promise<Response>;

type CodedError = Error & { code?: string; meta?: { target?: unknown } };

function isCodedError(error: unknown): error is CodedError {
  return error instanceof Error && "code" in error;
}

function normalizeError(error: unknown): HttpError {
  if (error instanceof HttpError) return error;

  // Prisma client errors are mapped without exposing database internals.
  if (isCodedError(error)) {
    if (error.code === "P2002") {
      return new ConflictError("A record with these details already exists");
    }
    if (error.code === "P2025") return new NotFoundError("Record not found");
    if (error.code === "P2003") {
      return new BadRequestError("This record is referenced by another record");
    }
  }

  return new HttpError("An unexpected error occurred", 500, "INTERNAL_SERVER_ERROR");
}

/** Wrap a Next.js route handler to provide one consistent API error response. */
export function withErrorHandler<Context = unknown>(handler: ApiHandler<Context>) {
  return async (request: Request, context: Context): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      const requestId = crypto.randomUUID();
      const normalized = normalizeError(error);

      if (normalized.statusCode >= 500) {
        console.error("API request failed", { requestId, error });
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: normalized.code,
            message: normalized.message,
            ...(normalized.details === undefined ? {} : { details: normalized.details }),
            requestId,
          },
        },
        { status: normalized.statusCode },
      );
    }
  };
}
