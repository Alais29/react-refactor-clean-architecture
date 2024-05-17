import { Product } from "./Product";
import { ProductRepository } from "./ProductRepository";

export class GetProductByIdUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: number): Promise<Product> {
    return this.productRepository.getById(id);
  }
}
