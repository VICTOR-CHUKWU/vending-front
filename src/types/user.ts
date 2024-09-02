export interface User {
    id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  picture: string | null;
  role: 'Seller' | 'Buyer'
  coins: number;
  createdAt: string;
  updatedAt: string;
  token?: string;
  }