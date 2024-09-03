import useSWR from 'swr';
import { getUser, saveUser, removeUser, saveToken, removeToken, successToast, getCart, saveCart } from '@/utils';
import { fetchUser, login, signup } from '@/services/user';
import {  User, productsResponse } from '@/types';
import { useRouter } from 'next/navigation';
import { fetchProducts, fetchPurchases } from '@/services/product';
import { TCartItem } from '@/types/product';


interface UsePurchasesOptions {
  page?: number;
  limit?: number;
}

const fetchUserFromLocalStorage = async (): Promise<User | null> => {
  if (typeof window !== 'undefined') {
    const storedUser = getUser();
    console.log(storedUser, 'users')
    return storedUser ? storedUser : null;
  }
  return null;
}

export const useUser = () => {
  const { data, mutate, error } = useSWR<User | null>('user', fetchUserFromLocalStorage);

  const updateUser = (user: User) => {
    saveUser(user);
    mutate(user);
  };

  const removeUserData = () => {
    removeUser();
    removeToken();
    mutate(null);
  };

  const deductCoins = (amount: number) => {
    if (data) {
      const updatedUser = {
        ...data,
        coins: data.coins - amount,
      };
      
      if (updatedUser.coins < 0) {
        console.error('Insufficient coins');
        return;
      }
      
      updateUser(updatedUser);
    }
  };

  return {
    user: data,
    isLoading: !data && !error,
    isError: error,
    updateUser,
    removeUserData,
    deductCoins
  };
};

export function useGetProducts() {
  const { data, error, mutate } = useSWR<productsResponse>(
    `products`,
    () => fetchProducts()
  );

  return {
    products: data,
    productLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export const useCart = () => {
  const { data: cart, error, mutate } = useSWR<TCartItem[]>('vascon-cart', getCart);

  const addToCartItem = (product: TCartItem) => {
    const currentCart = cart || [];
    const existingItem = currentCart.find(item => item.id === product.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = currentCart.map(item =>
        item.id === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, qty: 1 }];
    }

    saveCart(updatedCart);
    mutate(updatedCart);
  };

  const removeFromCartItem = (productId: string) => {
    const updatedCart = cart?.filter(item => item.id !== productId) || [];
    saveCart(updatedCart);
    mutate(updatedCart);
  };

  const increaseQty = (productId: string) => {
    const updatedCart = cart?.map(item =>
      item.id === productId ? { ...item, qty: item.qty + 1 } : item
    ) || [];
    saveCart(updatedCart);
    mutate(updatedCart);
  };

  const decreaseQty = (productId: string) => {
    const updatedCart = cart?.map(item =>
      item.id === productId && item.qty > 1
        ? { ...item, qty: item.qty - 1 }
        : item
    ) || [];
    saveCart(updatedCart);
    mutate(updatedCart);
  };

  const removeAllFromCart = () => {
    const updatedCart: TCartItem[] = [];
    saveCart(updatedCart);
    mutate(updatedCart);
  };


  const totalCost = cart?.reduce((total, item) => total + item.cost * item.qty, 0) || 0;

  return {
    cart,
    isLoading: !cart && !error,
    isError: error,
    addToCartItem,
    removeFromCartItem,
    increaseQty,
    decreaseQty,
    totalCost,
    removeAllFromCart
  };
};


export const usePurchases = ({ page, limit }: UsePurchasesOptions) => {
  const { data, error, mutate } = useSWR(
    [`/products/purchases`, page, limit], 
    () => fetchPurchases(page, limit), 
    {
      revalidateOnFocus: false, 
      revalidateOnReconnect: false, 
    }
  );

  return {
    purchases: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
