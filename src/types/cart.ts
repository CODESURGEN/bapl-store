export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  variant: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
