import { describe, expect, test } from "vitest";
import { Product } from "../Product";

describe("Product", () => {
  test("should create product with status active if price is greater than 0", () => {
    const product = Product.create({ id: 1, title: "title", image: "image", price: "2.4" });

    expect(product.status).toBe("active");
  });

  test("should create product with status inactive if price is equal to 0", () => {
    const product = Product.create({ id: 1, title: "title", image: "image", price: "0" });

    expect(product.status).toBe("inactive");
  });
});
