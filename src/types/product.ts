export interface TProduct {
    id: string;
    productName: string;
    cost: number;
    amountRemaining: number;
    productImages: string[];
    createdAt: string;
    updatedAt: string;
  };

  export interface TCartItem extends TProduct {
    qty: number
  }
  
  export type TProductPurchase = {
    id: string;
    quantity: number;
    product: TProduct;
  };
  
  export type TPurchase = {
    id: string;
    totalCost: number;
    createdAt: string;
    productPurchases: TProductPurchase[];
  };