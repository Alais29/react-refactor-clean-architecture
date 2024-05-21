import { describe, expect, test } from "vitest";
import { Price } from "../Price";

describe("Price", () => {
  test("should create price if all validations are ok", () => {
    const price = Price.create("2.4");

    expect(price).toBeTruthy();
  });

  test("should throw error for negative price", () => {
    expect(() => Price.create("-2.4")).toThrowError("Invalid price format");
  });

  test("should throw error for non number price", () => {
    expect(() => Price.create("nonnumber")).toThrowError("Only numbers are allowed");
  });

  test("should throw error if price is bigger than 999.99", () => {
    expect(() => Price.create("1000")).toThrowError("The max possible price is 999.99");
  });
});
