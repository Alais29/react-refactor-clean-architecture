import { useCallback, useEffect, useState } from "react";
import { useReload } from "./useReload";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { GetProductByIdUseCase } from "../../domain/GetProductByIdUseCase";
import { ResourceNotFound } from "../../domain/ProductRepository";
import { Price, ValidationError } from "../../domain/Price";

export type ProductStatus = "active" | "inactive";

export type ProductViewModel = Product & { status: ProductStatus };

export const useProducts = (
  getProductsUseCase: GetProductsUseCase,
  getProductByIdUseCase: GetProductByIdUseCase
) => {
  const [reloadKey, reload] = useReload();

  const [products, setProducts] = useState<ProductViewModel[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductViewModel | undefined>(undefined);

  const [error, setError] = useState<string>();
  const [priceError, setPriceError] = useState<string | undefined>(undefined);

  const { currentUser } = useAppContext();

  useEffect(() => {
    getProductsUseCase.execute().then(products => {
      console.debug("Reloading", reloadKey);

      setProducts(products.map(buildProductViewModel));
    });
  }, [getProductsUseCase, reloadKey]);

  const updatingQuantity = useCallback(
    async (id: number) => {
      if (id) {
        if (!currentUser.isAdmin) {
          setError("Only admin users can edit the price of a product");
          return;
        }

        try {
          const product = await getProductByIdUseCase.execute(id);
          setEditingProduct(buildProductViewModel(product));
        } catch (error) {
          if (error instanceof ResourceNotFound) {
            setError(error.message);
          } else {
            setError("Unexpected error has ocurred");
          }
        }
      }
    },
    [currentUser.isAdmin, getProductByIdUseCase]
  );

  const cancelEditPrice = useCallback(() => {
    setEditingProduct(undefined);
  }, [setEditingProduct]);

  function onChangePrice(price: string): void {
    if (!editingProduct) return;

    try {
      setEditingProduct({ ...editingProduct, price: price });

      Price.create(price);
      setPriceError(undefined);
    } catch (error) {
      if (error instanceof ValidationError) {
        setPriceError(error.message);
      } else {
        setPriceError("Unexpected error has occured");
      }
    }
  }

  return {
    reload,
    products,
    updatingQuantity,
    editingProduct,
    setEditingProduct,
    error,
    cancelEditPrice,
    priceError,
    onChangePrice,
  };
};

function buildProductViewModel(product: Product): ProductViewModel {
  return {
    ...product,
    status: +product.price === 0 ? "inactive" : "active",
  };
}
