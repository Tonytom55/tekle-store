/*
  # Complete E-commerce Database Schema

  1. New Tables
    - `products` - Product catalog
    - `orders` - Customer orders
    - `wishlists` - User wishlist items
    - `addresses` - User saved addresses
    - `product_reviews` - Product reviews and ratings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Storage
    - Product images bucket
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price decimal NOT NULL,
  original_price decimal,
  images text[] NOT NULL,
  category text NOT NULL,
  brand text NOT NULL,
  in_stock boolean DEFAULT true,
  stock_quantity integer DEFAULT 0,
  rating decimal DEFAULT 0,
  review_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  profit_margin decimal DEFAULT 30,
  specifications jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_address jsonb NOT NULL,
  items jsonb NOT NULL,
  total_amount decimal NOT NULL,
  payment_method text DEFAULT 'cod',
  payment_status text DEFAULT 'pending',
  order_status text DEFAULT 'placed',
  delivery_notes text,
  tracking_number text,
  estimated_delivery timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  street text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  postal_code text NOT NULL,
  phone text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Products policies (public read access)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete products" ON products
  FOR DELETE TO authenticated USING (true);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create orders" ON orders
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can manage their own wishlist" ON wishlists
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Address policies
CREATE POLICY "Users can manage their own addresses" ON addresses
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Product reviews policies
CREATE POLICY "Anyone can read reviews" ON product_reviews
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own reviews" ON product_reviews
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view product images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects 
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images" ON storage.objects 
  FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images" ON storage.objects 
  FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- Function to update product rating when reviews change
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM product_reviews 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM product_reviews 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update product rating
DROP TRIGGER IF EXISTS update_product_rating_trigger ON product_reviews;
CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE addresses 
    SET is_default = false 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for default address
DROP TRIGGER IF EXISTS ensure_single_default_address_trigger ON addresses;
CREATE TRIGGER ensure_single_default_address_trigger
  BEFORE INSERT OR UPDATE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_address();