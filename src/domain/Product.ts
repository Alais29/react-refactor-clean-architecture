import { Price } from "./Price";
import { Entity } from "./core/Entity";

export interface ProductData {
  id: number;
  title: string;
  image: string;
  price: string;
}

type ProductEntityData = Omit<ProductData, "price"> & {
  price: Price;
  status: ProductStatus;
};

export type ProductStatus = "active" | "inactive";

export class Product extends Entity {
  readonly id: number;
  readonly title: string;
  readonly image: string;
  readonly price: Price;
  readonly status: ProductStatus;

  private constructor(data: ProductEntityData) {
    super(data.id);

    this.id = data.id;
    this.title = data.title;
    this.image = data.image;
    this.price = data.price;
    this.status = data.status;
  }

  static create(data: ProductData): Product {
    const price = Price.create(data.price);
    return new Product({ ...data, price, status: price.value === 0 ? "inactive" : "active" });
  }
}
