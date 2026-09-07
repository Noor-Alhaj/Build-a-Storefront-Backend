export type User = {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  password_digest: string;
  created_at?: Date;
};

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
  description?: string;
  created_at?: Date;
};

export type Order = {
  id?: number;
  user_id: number;
  status: string;
  created_at?: Date;
};

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export type OrderWithProducts = Order & {
  products: (Product & { quantity: number })[];
};
