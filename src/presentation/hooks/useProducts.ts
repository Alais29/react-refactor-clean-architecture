import { useCallback, useEffect, useState } from "react";
import { useReload } from "./useReload";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";
import { StoreApi } from "../../data/api/StoreApi";
import { useAppContext } from "../context/useAppContext";
import { buildProduct } from "../../data/ProductApiRepository";

export const useProducts = (getProductsUseCase: GetProductsUseCase, storeApi: StoreApi) => {
  const [reloadKey, reload] = useReload();

  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const [error, setError] = useState<string>();

  const { currentUser } = useAppContext();

  useEffect(() => {
    getProductsUseCase.execute().then(products => {
      console.debug("Reloading", reloadKey);
      setProducts(products);
    });
  }, [getProductsUseCase, reloadKey]);

  const updatingQuantity = useCallback(
    async (id: number) => {
      if (id) {
        if (!currentUser.isAdmin) {
          setError("Only admin users can edit the price of a product");
          return;
        }

        storeApi
          .get(id)
          .then(buildProduct)
          .then(product => {
            setEditingProduct(product);
          })
          .catch(() => {
            setError(`Product with id ${id} not found`);
          });
      }
    },
    [currentUser.isAdmin, storeApi]
  );

  const cancelEditPrice = useCallback(() => {
    setEditingProduct(undefined);
  }, [setEditingProduct]);

  return {
    reload,
    products,
    updatingQuantity,
    editingProduct,
    setEditingProduct,
    error,
    cancelEditPrice,
  };
};
