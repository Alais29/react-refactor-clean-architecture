import { useEffect, useState } from "react";
import { useReload } from "./useReload";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";

export const useProducts = (getProductsUseCase: GetProductsUseCase) => {
  const [reloadKey, reload] = useReload();

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProductsUseCase.execute().then(products => {
      console.debug("Reloading", reloadKey);
      setProducts(products);
    });
  }, [getProductsUseCase, reloadKey]);

  return { reload, products };
};
