import { TPagination, User } from ".";
import { TProduct, TPurchase } from "./product";


export interface DefaultResponse {
    success: boolean;
    status: number;
    message: string;
    data: any;
    pagination: TPagination | null;
}

export interface UserResponseData extends DefaultResponse {
   data: User
}


export interface UsersResponse extends DefaultResponse {
    data: User[];
  }

  export interface productsResponse extends DefaultResponse {
    data: TProduct[];
  }

  export interface productResponse extends DefaultResponse {
    data: TProduct;
  }

  export interface purchasesResponse extends DefaultResponse {
    data: TPurchase[];
  }

  export interface purchaseResponse extends DefaultResponse {
    data: TPurchase;
  }