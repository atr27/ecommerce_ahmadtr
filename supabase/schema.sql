-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE product_category AS ENUM ('PS5', 'Xbox', 'Nintendo', 'PC');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

-- Products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category product_category NOT NULL,
    image_url TEXT,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Favorites table
CREATE TABLE favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    status order_status NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Row Level Security (RLS) policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products policies (public read, admin write)
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Products are insertable by authenticated users" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products are updatable by authenticated users" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Cart items policies (users can only access their own cart)
CREATE POLICY "Users can view their own cart items" ON cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON cart_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart_items
    FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies (users can only access their own favorites)
CREATE POLICY "Users can view their own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Orders policies (users can only access their own orders)
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Order items policies (users can only access their own order items)
CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, stock) VALUES
('Spider-Man 2', 'The incredible power of the symbiote forces Peter and Miles to face the ultimate test of strength, both inside and outside the mask.', 699000, 'PS5', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', 25),
('God of War Ragnarök', 'Embark on an epic and heartfelt journey as Kratos and Atreus struggle with holding on and letting go.', 699000, 'PS5', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500', 30),
('Horizon Forbidden West', 'Join Aloy as she braves the Forbidden West, a majestic but dangerous frontier that conceals mysterious new threats.', 599000, 'PS5', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500', 20),
('The Last of Us Part I', 'Experience the emotional storytelling and unforgettable characters in Joel and Ellie''s journey through a pandemic-ravaged world.', 699000, 'PS5', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500', 15),
('Gran Turismo 7', 'Whether you''re a competitive or casual racer, collector, tuner, livery designer or photographer – find your line with a staggering collection of game modes.', 699000, 'PS5', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500', 18),

('Halo Infinite', 'Master Chief returns in the most expansive Master Chief story yet.', 599000, 'Xbox', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500', 22),
('Forza Horizon 5', 'Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico.', 599000, 'Xbox', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500', 28),
('Gears 5', 'From one of gaming''s most acclaimed sagas, Gears is bigger than ever, with five thrilling modes and the deepest campaign yet.', 499000, 'Xbox', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500', 16),
('Microsoft Flight Simulator', 'Take to the skies and experience the joy of flight in the next generation of Microsoft Flight Simulator.', 599000, 'Xbox', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500', 12),
('Sea of Thieves', 'Set sail for adventure in the ultimate pirate experience! Embark on epic voyages with your crew.', 399000, 'Xbox', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500', 35),

('The Legend of Zelda: Tears of the Kingdom', 'An epic adventure across the land and skies of Hyrule awaits in this sequel to The Legend of Zelda: Breath of the Wild.', 899000, 'Nintendo', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', 40),
('Super Mario Odyssey', 'Join Mario on a massive, globe-trotting 3D adventure and use his incredible new abilities to collect Moons.', 699000, 'Nintendo', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', 32),
('Mario Kart 8 Deluxe', 'Hit the road with the definitive version of Mario Kart 8 and play anytime, anywhere!', 699000, 'Nintendo', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500', 45),
('Animal Crossing: New Horizons', 'Escape to a deserted island and create your own paradise as you explore, create, and customize in Animal Crossing: New Horizons.', 699000, 'Nintendo', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500', 28),
('Splatoon 3', 'Enter the Splatlands, a sun-scorched desert inhabited by battle-hardened Inklings and Octolings.', 699000, 'Nintendo', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500', 24),

('Cyberpunk 2077', 'An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.', 599000, 'PC', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500', 20),
('Elden Ring', 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.', 699000, 'PC', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500', 18),
('Red Dead Redemption 2', 'Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is an epic tale of honor and loyalty.', 599000, 'PC', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500', 15),
('Grand Theft Auto V', 'Experience Rockstar Games'' critically acclaimed open world game, Grand Theft Auto V.', 399000, 'PC', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500', 50),
('The Witcher 3: Wild Hunt', 'You are Geralt of Rivia, mercenary monster slayer. At your disposal is every tool of the trade.', 299000, 'PC', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500', 30);
