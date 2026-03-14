/**
 * LIKEFOOD - Validation Schemas Tests
 */

import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { validationErrorResponse, createZodValidation } from "@/lib/validations/utils";
import { productSchema } from "@/lib/validations/product";
import { createOrderRequestSchema } from "@/lib/validations/order";
import { addToCartSchema } from "@/lib/validations/cart";
import { createReviewSchema } from "@/lib/validations/review";
import { couponSchema } from "@/lib/validations/coupon";

// Mock logger to avoid side effects
vi.mock("@/lib/logger", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Validation Utils", () => {
  describe("validationErrorResponse", () => {
    it("should format Zod errors correctly", () => {
      const schema = z.object({
        email: z.string().email("Invalid email"),
        name: z.string().min(1, "Name is required"),
      });

      const result = schema.safeParse({ email: "invalid", name: "" });
      
      if (!result.success) {
        const response = validationErrorResponse(result.error);
        expect(response.error).toBe("Validation failed");
        expect(response.code).toBe("VALIDATION_ERROR");
        expect(response.details).toBeDefined();
      }
    });

    it("should handle multiple field errors", () => {
      const schema = z.object({
        email: z.string().email("Invalid email"),
        age: z.number().min(18, "Must be 18+"),
      });

      const result = schema.safeParse({ email: "invalid", age: 15 });
      
      if (!result.success) {
        const response = validationErrorResponse(result.error);
        expect(Object.keys(response.details || {}).length).toBeGreaterThan(0);
      }
    });
  });

  describe("createZodValidation", () => {
    it("should create a validation wrapper", () => {
      const schema = z.object({
        name: z.string().min(1),
        price: z.number().positive(),
      });

      const validate = createZodValidation(schema);
      
      const result = validate({ name: "Test", price: 100 });
      expect(result.success).toBe(true);
      
      const invalidResult = validate({ name: "", price: -1 });
      expect(invalidResult.success).toBe(false);
    });
  });
});

describe("Product Validation", () => {
  
  it("should validate valid product data", () => {
    const validProduct = {
      name: "Cá khô",
      price: 29.99,
      category: "ca-kho",
    };
    
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("should reject invalid product data", () => {
    const invalidProduct = {
      name: "",
      price: -10,
    };
    
    const result = productSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });
});

describe("Order Validation", () => {
  
  it("should validate valid order data", () => {
    const validOrder = {
      items: [
        { productId: "prod_123", quantity: 2 }
      ],
      shippingAddress: "123 Main St",
      shippingCity: "New York",
      shippingZipCode: "10001",
      shippingPhone: "+1234567890",
      paymentMethod: "STRIPE",
    };
    
    const result = createOrderRequestSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it("should reject order with empty items", () => {
    const invalidOrder = {
      items: [],
      shippingAddress: "123 Main St",
    };
    
    const result = createOrderRequestSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
  });

  it("should reject order with negative quantity", () => {
    const invalidOrder = {
      items: [{ productId: "prod_123", quantity: -1 }],
    };
    
    const result = createOrderRequestSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
  });
});

describe("Cart Validation", () => {
  
  it("should validate valid cart item", () => {
    const validItem = {
      productId: "prod_123",
      quantity: 1,
    };
    
    const result = addToCartSchema.safeParse(validItem);
    expect(result.success).toBe(true);
  });

  it("should reject cart item with zero quantity", () => {
    const invalidItem = {
      productId: "prod_123",
      quantity: 0,
    };
    
    const result = addToCartSchema.safeParse(invalidItem);
    expect(result.success).toBe(false);
  });
});

describe("Review Validation", () => {
  
  it("should validate valid review", () => {
    const validReview = {
      productId: "prod_123",
      rating: 5,
      comment: "Great product!",
    };
    
    const result = createReviewSchema.safeParse(validReview);
    expect(result.success).toBe(true);
  });

  it("should reject review with invalid rating", () => {
    const invalidReview = {
      productId: "prod_123",
      rating: 6,
    };
    
    const result = createReviewSchema.safeParse(invalidReview);
    expect(result.success).toBe(false);
  });
});

describe("Coupon Validation", () => {
  
  it("should validate valid coupon", () => {
    const validCoupon = {
      code: "SAVE20",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minOrderValue: 50,
    };
    
    const result = couponSchema.safeParse(validCoupon);
    expect(result.success).toBe(true);
  });

  it("should reject coupon with invalid discount value", () => {
    const invalidCoupon = {
      code: "INVALID",
      discountType: "PERCENTAGE",
      discountValue: 150,
    };
    
    const result = couponSchema.safeParse(invalidCoupon);
    expect(result.success).toBe(false);
  });
});
