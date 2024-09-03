export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface SignupPayload {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
    password: string;
    role: "Seller" | "Buyer";
  }
  
  export interface UpdateProfilePayload {
    firstName: string;
    lastName: string;
    picture?: string;
  }

  export interface ProductPurchasePayload {
    quantity: number;
    productId: string;
  };

  export interface ProductCreationPayload {
    productName: string;
    cost: number;
    amountRemaining: number;
    sellerId: string;
    productImages?: string[];
  };


 export type UpdateProductPayload = Partial<ProductCreationPayload>;
  
  
  