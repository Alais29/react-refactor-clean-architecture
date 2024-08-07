import { ProductData, ProductStatus } from "../../domain/Product";

export type ProductViewModel = ProductData & { status: ProductStatus };

export type Message = { type: "error" | "success"; text: string };

export type useProductState = {
  products: ProductViewModel[];
  updatingQuantity: (id: number) => Promise<void>;
  editingProduct: ProductViewModel | undefined;
  message: Message | undefined;
  cancelEditPrice: () => void;
  onChangePrice: (price: string) => void;
  priceError: string | undefined;
  saveEditPrice: () => Promise<void>;
  onCloseMessage: () => void;
};
