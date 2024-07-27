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

  test("should edit Product and assign status active if new price is greater than 0", () => {
    const product = Product.create({ id: 1, title: "title", image: "image", price: "2.4" });

    const editedProduct = product.editPrice("3.4");

    expect(editedProduct.status).toBe("active");
    expect(editedProduct.price.value).toBe(3.4);
  });

  test("should edit Product and assign status inactive if new price is equal to 0", () => {
    const product = Product.create({ id: 1, title: "title", image: "image", price: "2.4" });

    const editedProduct = product.editPrice("0");

    expect(editedProduct.status).toBe("inactive");
    expect(editedProduct.price.value).toBe(0);
  });
});
