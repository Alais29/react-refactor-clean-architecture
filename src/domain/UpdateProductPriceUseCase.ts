import { StoreApi } from "../data/api/StoreApi";
import { User } from "../presentation/context/AppContext";

export class ActionNotAllowedError extends Error {}

export class UpdateProductPriceUseCase {
  constructor(private storeApi: StoreApi) {}

  async execute(user: User, id: number, price: string): Promise<void> {
    if (!user.isAdmin) {
      throw new ActionNotAllowedError("Only admins can edit the price of a product");
    }

    const remoteProduct = await this.storeApi.get(id);

    if (!remoteProduct) return;

    const editedRemoteProduct = {
      ...remoteProduct,
      price: Number(price),
    };

    await this.storeApi.post(editedRemoteProduct);
  }
}
