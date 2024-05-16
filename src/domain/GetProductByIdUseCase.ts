import { buildProduct } from "../data/ProductApiRepository";
import { StoreApi } from "../data/api/StoreApi";
import { Product } from "./Product";

export class ResourceNotFound extends Error {}

export class GetProductByIdUseCase {
  constructor(private storeApi: StoreApi) {}
  async execute(id: number): Promise<Product> {
    try {
      const remoteProduct = await this.storeApi.get(id);
      return buildProduct(remoteProduct);
    } catch (error) {
      throw new ResourceNotFound(`Product with id ${id} not found`);
    }
  }
}
