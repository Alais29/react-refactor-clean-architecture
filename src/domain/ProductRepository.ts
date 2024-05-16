import { Product } from "./Product";

export interface ProductRepository {
  getAll(): Promise<Product[]>;
}
