import { Product } from "../domain/Product";
import { ProductRepository, ResourceNotFound } from "../domain/ProductRepository";
import { RemoteProduct, StoreApi } from "./api/StoreApi";

export class ProductApiRepository implements ProductRepository {
  constructor(private storeApi: StoreApi) {}
  async getAll(): Promise<Product[]> {
    const remoteProducts = await this.storeApi.getAll();
    return remoteProducts.map(buildProduct);
  }
  async getById(id: number): Promise<Product> {
    try {
      const remoteProduct = await this.storeApi.get(id);
      return buildProduct(remoteProduct);
    } catch (error) {
      throw new ResourceNotFound(`Product with id ${id} not found`);
    }
  }

  async save(product: Product): Promise<void> {
    const remoteProduct = await this.storeApi.get(product.id);

    if (!remoteProduct) return;

    const editedRemoteProduct = {
      ...remoteProduct,
      price: Number(product.price.value),
    };

    return this.storeApi.post(editedRemoteProduct);
  }
}

function buildProduct(remoteProduct: RemoteProduct): Product {
  return Product.create({
    id: remoteProduct.id,
    title: remoteProduct.title,
    image: remoteProduct.image,
    price: remoteProduct.price.toString(),
  });
}
