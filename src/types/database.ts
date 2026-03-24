export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: "user" | "admin";
          default_address: string | null;
          default_city: string | null;
          default_state: string | null;
          default_pincode: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          short_description: string;
          price: number;
          compare_at_price: number | null;
          category: string;
          image_url: string;
          badge: string | null;
          in_stock: boolean;
          variants: ProductVariant[];
          features: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: string;
          city: string;
          state: string;
          pincode: string;
          items: OrderItem[];
          subtotal: number;
          shipping: number;
          total: number;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          razorpay_signature: string | null;
          payment_status: "pending" | "paid" | "failed" | "refunded";
          order_status: "placed" | "confirmed" | "shipped" | "delivered" | "cancelled";
          updated_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
    };
  };
}

export interface ProductVariant {
  size: string;
  price: number;
  compare_at_price?: number;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  variant: string;
  quantity: number;
  price: number;
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
