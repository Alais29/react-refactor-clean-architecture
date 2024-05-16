import { Product } from "./Product";
import { ProductRepository } from "./ProductRepository";

export class GetProductsUseCase {
  constructor(private ProductRepository: ProductRepository) {}
  async execute(): Promise<Product[]> {
    return this.ProductRepository.getAll();
  }
}
