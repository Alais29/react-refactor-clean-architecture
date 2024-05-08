export class StoreApi {
    cache: RemoteProduct[] = [];

    async getAll(): Promise<RemoteProduct[]> {
        return this.getProducts();
    }

    async get(id: number): Promise<RemoteProduct> {
        const remoteProduct = await this.getProduct(id);

        return remoteProduct;
    }

    async post(productToUpdate: RemoteProduct): Promise<void> {
        const existedProduct = await this.getProduct(productToUpdate.id);

        if (existedProduct) {
            this.cache = this.cache.map(product => {
                return product.id === productToUpdate.id ? productToUpdate : product;
            });
  
        } else {
            this.cache = [...this.cache, productToUpdate];
        }
    }

    private async getProducts(): Promise<RemoteProduct[]> {
        //fakestoreapi is a not real database then we update the cache
        if (this.cache.length === 0) {
            const products = await fetch("https://fakestoreapi.com/products").then(res =>
                res.json()
            );
            this.cache = products;
            return products;
        } else {
            return this.cache;
        }
    }

    private async getProduct(id: number): Promise<RemoteProduct> {

        //fakestoreapi is a not real database then we update the cache
        if (this.cache.length === 0) {
            await this.getAll();
        }

        const product = this.cache.find(product => product.id === id);

        if (!product) {
            throw new Error(`Product with id ${id} not found`);
        }

        return product;
    }
}

export interface RemoteProduct {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number;
    rating: { rate: number; count: number };
}
