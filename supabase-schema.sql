CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  default_address TEXT,
  default_city TEXT,
  default_state TEXT,
  default_pincode TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  compare_at_price NUMERIC(10,2),
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  badge TEXT,
  in_stock BOOLEAN DEFAULT true,
  variants JSONB NOT NULL DEFAULT '[]',
  features TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status TEXT NOT NULL DEFAULT 'placed'
    CHECK (order_status IN ('placed', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Anyone can place orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);

INSERT INTO products (name, slug, description, short_description, price, compare_at_price, category, image_url, badge, in_stock, variants, features)
VALUES
  (
    'Sona Masoori Rice',
    'sona-masoori',
    'Our premium Sona Masoori rice is a lightweight, aromatic short-grain variety that is the pride of Telangana. Carefully milled using state-of-the-art machinery, each grain is polished to perfection. Ideal for daily cooking — from fluffy steamed rice to biryanis and pulao. Low in starch and easy to digest, making it the healthiest choice for your family.',
    'Light, aromatic short-grain rice — perfect for daily cooking.',
    55.00,
    65.00,
    'Premium',
    '/images/products/rice1.png',
    'Popular',
    true,
    '[{"size": "1 Kg", "price": 55, "compare_at_price": 65}, {"size": "5 Kg", "price": 260, "compare_at_price": 310}, {"size": "10 Kg", "price": 500, "compare_at_price": 600}, {"size": "25 Kg", "price": 1200, "compare_at_price": 1450}]',
    ARRAY['Low glycemic index', 'Lightweight & aromatic', 'Ideal for daily meals', 'Easy to digest']
  ),
  (
    'BPT Samba Mahsuri Rice',
    'bpt-samba-mahsuri',
    'BPT Samba Mahsuri — also known as BPT 5204 — is a fine-grain rice renowned for its soft texture and fluffy finish when cooked. Aged to perfection in our facilities, this variety absorbs flavours beautifully, making it the top choice for biryanis, fried rice, and festive meals. Trusted by chefs and households across South India.',
    'Aged, fine-grain rice with a fluffy finish — biryani favourite.',
    62.00,
    72.00,
    'Premium',
    '/images/products/rice2.png',
    'Premium',
    true,
    '[{"size": "1 Kg", "price": 62, "compare_at_price": 72}, {"size": "5 Kg", "price": 295, "compare_at_price": 345}, {"size": "10 Kg", "price": 570, "compare_at_price": 670}, {"size": "25 Kg", "price": 1380, "compare_at_price": 1620}]',
    ARRAY['Aged for superior taste', 'Soft & fluffy texture', 'Perfect for biryani', 'Premium quality grain']
  ),
  (
    'HMT Rice',
    'hmt-rice',
    'HMT Rice is a classic, time-tested variety loved for its non-sticky, slender grains. Each grain cooks separately, making it perfect for sambar rice, curd rice, and everyday meals. Sourced from the finest paddies in the Telangana region and milled with precision to retain natural nutrition and flavour.',
    'Classic non-sticky, slender grains for everyday meals.',
    48.00,
    58.00,
    'Classic',
    '/images/products/rice3.png',
    'Classic',
    true,
    '[{"size": "1 Kg", "price": 48, "compare_at_price": 58}, {"size": "5 Kg", "price": 225, "compare_at_price": 275}, {"size": "10 Kg", "price": 430, "compare_at_price": 530}, {"size": "25 Kg", "price": 1050, "compare_at_price": 1300}]',
    ARRAY['Non-sticky grains', 'Cooks separately', 'Great for daily use', 'Naturally nutritious']
  ),
  (
    'Kolam Rice',
    'kolam-rice',
    'Kolam Rice is a fine, smooth-textured variety with a subtle aroma that enhances any meal. Its medium grain size and easy-cook nature make it a staple in homes and restaurants alike. Milled with care to preserve the natural shine and nutritional value.',
    'Fine, smooth-textured rice with a subtle aroma.',
    52.00,
    60.00,
    'Aromatic',
    '/images/products/rice4.png',
    'Aromatic',
    true,
    '[{"size": "1 Kg", "price": 52, "compare_at_price": 60}, {"size": "5 Kg", "price": 245, "compare_at_price": 285}, {"size": "10 Kg", "price": 470, "compare_at_price": 550}, {"size": "25 Kg", "price": 1150, "compare_at_price": 1350}]',
    ARRAY['Subtle natural aroma', 'Smooth texture', 'Versatile cooking', 'Medium grain']
  )
ON CONFLICT (slug) DO NOTHING;
