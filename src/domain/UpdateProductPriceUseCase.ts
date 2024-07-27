import { User } from "../presentation/context/AppContext";
import { ProductRepository } from "./ProductRepository";

export class ActionNotAllowedError extends Error {}

export class UpdateProductPriceUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(user: User, id: number, price: string): Promise<void> {
    if (!user.isAdmin) {
      throw new ActionNotAllowedError("Only admins can edit the price of a product");
    }

    const product = await this.productRepository.getById(id);

    const editedProduct = product.editPrice(price);

    return this.productRepository.save(editedProduct);
  }
}
