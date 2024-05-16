import { Product } from "../domain/Product";
import { ProductRepository } from "../domain/ProductRepository";
import { RemoteProduct, StoreApi } from "./api/StoreApi";

export class ProductApiRepository implements ProductRepository {
  constructor(private storeApi: StoreApi) {}
  async getAll(): Promise<Product[]> {
    const remoteProducts = await this.storeApi.getAll();
    return remoteProducts.map(buildProduct);
  }
}

export function buildProduct(remoteProduct: RemoteProduct): Product {
  return {
    id: remoteProduct.id,
    title: remoteProduct.title,
    image: remoteProduct.image,
    price: remoteProduct.price.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }),
  };
}
