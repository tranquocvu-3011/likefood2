/**
 * LIKEFOOD - API Error Response Tests
 */

import { describe, it, expect, vi } from "vitest";
import {
  apiError,
  validationError,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
  internalError,
  rateLimited,
  conflict,
} from "@/lib/api-error";
import { z, ZodError } from "zod";

describe("API Error Utilities", () => {
  describe("apiError", () => {
    it("should create a validation error response", () => {
      const response = apiError("Validation failed", "VALIDATION_ERROR");
      
      expect(response.status).toBe(400);
      const body = JSON.parse(response.body as string);
      expect(body.error).toBe("Validation failed");
      expect(body.code).toBe("VALIDATION_ERROR");
      expect(body.timestamp).toBeDefined();
    });

    it("should create a not found error response", () => {
      const response = notFound("Product not found");
      
      expect(response.status).toBe(404);
      const body = JSON.parse(response.body as string);
      expect(body.error).toBe("Product not found");
      expect(body.code).toBe("NOT_FOUND");
    });

    it("should create an unauthorized error response", () => {
      const response = unauthorized();
      
      expect(response.status).toBe(401);
      const body = JSON.parse(response.body as string);
      expect(body.code).toBe("UNAUTHORIZED");
    });

    it("should create a forbidden error response", () => {
      const response = forbidden();
      
      expect(response.status).toBe(403);
      const body = JSON.parse(response.body as string);
      expect(body.code).toBe("FORBIDDEN");
    });

    it("should create a bad request error response", () => {
      const response = badRequest("Invalid input");
      
      expect(response.status).toBe(400);
      const body = JSON.parse(response.body as string);
      expect(body.error).toBe("Invalid input");
    });

    it("should create a rate limited error response", () => {
      const response = rateLimited();
      
      expect(response.status).toBe(429);
      const body = JSON.parse(response.body as string);
      expect(body.code).toBe("RATE_LIMITED");
    });

    it("should create a conflict error response", () => {
      const response = conflict("Resource already exists");
      
      expect(response.status).toBe(409);
      const body = JSON.parse(response.body as string);
      expect(body.code).toBe("CONFLICT");
    });
  });

  describe("validationError", () => {
    it("should create validation error from Zod schema", () => {
      const schema = z.object({
        email: z.string().email(),
        name: z.string().min(1),
      });

      try {
        schema.parse({ email: "invalid", name: "" });
      } catch (e) {
        const response = validationError(e as ZodError);
        
        expect(response.status).toBe(400);
        const body = JSON.parse(response.body as string);
        expect(body.code).toBe("VALIDATION_ERROR");
        expect(body.details).toBeDefined();
      }
    });
  });

  describe("internalError", () => {
    it("should hide error details in production", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      
      const response = internalError("Database connection failed");
      
      const body = JSON.parse(response.body as string);
      expect(body.error).toBe("Internal server error");
      expect(body.code).toBe("INTERNAL_ERROR");
      
      process.env.NODE_ENV = originalEnv;
    });

    it("should show error details in development", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";
      
      const response = internalError("Database connection failed");
      
      const body = JSON.parse(response.body as string);
      expect(body.error).toBe("Database connection failed");
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("Error Code Mapping", () => {
    it("should map all error codes to correct status codes", () => {
      const errorTests = [
        { code: "VALIDATION_ERROR", status: 400 },
        { code: "UNAUTHORIZED", status: 401 },
        { code: "FORBIDDEN", status: 403 },
        { code: "NOT_FOUND", status: 404 },
        { code: "ALREADY_EXISTS", status: 409 },
        { code: "RATE_LIMITED", status: 429 },
        { code: "INTERNAL_ERROR", status: 500 },
        { code: "BAD_REQUEST", status: 400 },
        { code: "CONFLICT", status: 409 },
        { code: "SERVICE_UNAVAILABLE", status: 503 },
      ];

      errorTests.forEach(({ code, status }) => {
        const response = apiError("Test error", code as any);
        expect(response.status).toBe(status);
      });
    });
  });
});
