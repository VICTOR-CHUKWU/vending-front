import { TCartItem } from "@/types/product";

export const getCart = (): TCartItem[] => {
    if (typeof window !== 'undefined') {
      const cart = localStorage.getItem('vascon-cart');
      return cart ? JSON.parse(cart) : [];
    }
    return [];
  };
  
  export const saveCart = (cart: TCartItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vascon-cart', JSON.stringify(cart));
    }
  };