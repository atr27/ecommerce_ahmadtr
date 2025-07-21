-- GameSphere Console Store - Database Seeder
-- This file contains sample data for the console games e-commerce store

-- Clear existing data (optional - uncomment if you want to reset)
-- TRUNCATE TABLE order_items, orders, favorites, cart_items, products RESTART IDENTITY CASCADE;

-- Insert sample products for each console category
INSERT INTO products (name, description, price, category, image_url, stock) VALUES

-- PS5 Games
('Spider-Man 2', 'Be Greater. Together. The incredible power of the symbiote forces Peter Parker and Miles Morales into a desperate fight.', 899000, 'PS5', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', 25),
('God of War Ragnarök', 'Embark on an epic and heartfelt journey as Kratos and Atreus struggle with holding on and letting go.', 899000, 'PS5', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', 30),
('Horizon Forbidden West', 'Join Aloy as she braves the Forbidden West - a majestic but dangerous frontier that conceals mysterious new threats.', 799000, 'PS5', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', 20),
('The Last of Us Part I', 'Experience the emotional storytelling and unforgettable characters in Joel and Ellie''s critically acclaimed adventure.', 799000, 'PS5', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500', 15),
('Gran Turismo 7', 'Whether you''re a competitive racer, collector, tuner, livery designer or photographer – find your line.', 699000, 'PS5', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 35),
('Ratchet & Clank: Rift Apart', 'Go dimension-hopping with Ratchet and Clank as they take on an evil emperor from another reality.', 699000, 'PS5', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500', 22),
('Demon''s Souls', 'Venture to the northern kingdom of Boletaria - a once prosperous land of knights now beset with unspeakable creatures.', 699000, 'PS5', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', 18),
('Returnal', 'Break the cycle of chaos on an alien planet in this third-person shooter with roguelike gameplay.', 599000, 'PS5', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500', 12),
('Ghost of Tsushima Director''s Cut', 'Forge a new path and wage an unconventional war for the freedom of Tsushima.', 799000, 'PS5', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', 28),
('Final Fantasy XVI', 'An epic dark fantasy where fate is writ by the Eikons and the Dominants who wield them.', 899000, 'PS5', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', 16),

-- Xbox Games
('Halo Infinite', 'When all hope is lost and humanity''s fate hangs in the balance, Master Chief is ready to confront the most ruthless foe he''s ever faced.', 699000, 'Xbox', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', 40),
('Forza Horizon 5', 'Your greatest Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico.', 699000, 'Xbox', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 32),
('Gears 5', 'From one of gaming''s most acclaimed sagas, Gears is bigger than ever, with five thrilling modes and the deepest campaign yet.', 599000, 'Xbox', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500', 25),
('Microsoft Flight Simulator', 'Take to the skies and experience the joy of flight in the next generation of Microsoft Flight Simulator.', 799000, 'Xbox', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500', 20),
('Sea of Thieves', 'Set sail for adventure in the ultimate pirate experience! Embark on epic voyages with your crew.', 499000, 'Xbox', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500', 45),
('Age of Empires IV', 'One of the most beloved real-time strategy games returns to glory with Age of Empires IV.', 599000, 'Xbox', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500', 18),
('Ori and the Will of the Wisps', 'Embark on a new journey in a vast, exotic world where you''ll encounter towering enemies and challenging puzzles.', 399000, 'Xbox', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500', 30),
('Psychonauts 2', 'Razputin Aquato, trained acrobat and powerful young psychic, has realized his lifelong dream of joining the Psychonauts.', 599000, 'Xbox', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', 22),
('Starfield', 'In this next generation role-playing game set amongst the stars, create any character you want and explore with unparalleled freedom.', 899000, 'Xbox', 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500', 35),
('Fable', 'A new beginning for the legendary Fable franchise. A heroic adventure like no other awaits.', 899000, 'Xbox', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', 0),

-- Nintendo Games
('The Legend of Zelda: Tears of the Kingdom', 'An epic adventure across the land and skies of Hyrule awaits in this sequel to Breath of the Wild.', 899000, 'Nintendo', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', 50),
('Super Mario Odyssey', 'Join Mario on a massive, globe-trotting 3D adventure and use his incredible new abilities to collect Moons.', 699000, 'Nintendo', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', 45),
('Mario Kart 8 Deluxe', 'Hit the road with the definitive version of Mario Kart 8 and play anytime, anywhere!', 699000, 'Nintendo', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 60),
('Super Smash Bros. Ultimate', 'The biggest crossover in gaming history! Fighters from across the Nintendo universe come together.', 699000, 'Nintendo', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500', 40),
('Animal Crossing: New Horizons', 'Escape to a deserted island and create your own paradise as you explore, create, and customize.', 699000, 'Nintendo', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500', 35),
('Metroid Dread', 'Join intergalactic bounty hunter Samus Aran in her first new 2D Metroid story in 19 years.', 699000, 'Nintendo', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500', 25),
('Pokémon Scarlet', 'Catch, battle, and train Pokémon in the Paldea Region, a land of vast open spaces dotted with lakes, towering peaks, wastelands, small towns, and sprawling cities.', 699000, 'Nintendo', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500', 30),
('Pokémon Violet', 'An open-world Pokémon adventure! Catch, battle, and train Pokémon in the Paldea Region.', 699000, 'Nintendo', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500', 30),
('Splatoon 3', 'Enter the Splatlands, a sun-scorched desert inhabited by battle-hardened Inklings and Octolings.', 699000, 'Nintendo', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500', 28),
('Kirby and the Forgotten Land', 'Join Kirby in an unforgettable journey through a mysterious world in a delightfully epic adventure.', 599000, 'Nintendo', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', 32),

-- PC Games
('Cyberpunk 2077', 'An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.', 699000, 'PC', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500', 25),
('Elden Ring', 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.', 699000, 'PC', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500', 18),
('Red Dead Redemption 2', 'Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is an epic tale of honor and loyalty.', 599000, 'PC', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500', 15),
('Grand Theft Auto V', 'Experience Rockstar Games'' critically acclaimed open world game, Grand Theft Auto V.', 399000, 'PC', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500', 50),
('The Witcher 3: Wild Hunt', 'You are Geralt of Rivia, mercenary monster slayer. At your disposal is every tool of the trade.', 299000, 'PC', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500', 30),
('Baldur''s Gate 3', 'Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival.', 799000, 'PC', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500', 22),
('Counter-Strike 2', 'For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players worldwide.', 0, 'PC', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500', 999),
('Valorant', 'Blend your style and experience on a global, competitive stage. You have 13 rounds to attack and defend your side using sharp gunplay and tactical abilities.', 0, 'PC', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', 999),
('Minecraft', 'Explore randomly generated worlds and build amazing things from the simplest of homes to the grandest of castles.', 399000, 'PC', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', 100),
('Among Us', 'An online and local party game of teamwork and betrayal for 4-15 players...in space!', 59000, 'PC', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', 200),
('Fall Guys', 'Stumble through rounds of escalating chaos until one victor remains in this colorful competition!', 0, 'PC', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500', 999),
('Apex Legends', 'Master an ever-growing roster of legendary characters with powerful abilities and experience strategic squad play.', 0, 'PC', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 999),
('Fortnite', 'Drop into the action with Fortnite Battle Royale! Build, explore, fight and survive.', 0, 'PC', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500', 999),
('League of Legends', 'Join the fight in the award-winning multiplayer online battle arena that started it all.', 0, 'PC', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500', 999),
('Dota 2', 'Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes.', 0, 'PC', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500', 999);

-- Insert some sample orders (for demonstration purposes)
-- Note: These would normally be created by actual user purchases
-- You can uncomment these if you want sample order data

/*
-- Sample orders (requires actual user IDs from auth.users)
INSERT INTO orders (user_id, total_amount, status, shipping_address, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 1398000, 'delivered', 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220', NOW() - INTERVAL '7 days'),
('00000000-0000-0000-0000-000000000001', 699000, 'shipped', 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220', NOW() - INTERVAL '2 days'),
('00000000-0000-0000-0000-000000000002', 1598000, 'paid', 'Jl. Gatot Subroto No. 456, Jakarta Selatan, DKI Jakarta 12930', NOW() - INTERVAL '1 day');

-- Sample order items (linked to the orders above)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
-- First order items
((SELECT id FROM orders WHERE total_amount = 1398000 LIMIT 1), (SELECT id FROM products WHERE name = 'Spider-Man 2' LIMIT 1), 1, 899000),
((SELECT id FROM orders WHERE total_amount = 1398000 LIMIT 1), (SELECT id FROM products WHERE name = 'Mario Kart 8 Deluxe' LIMIT 1), 1, 699000),
-- Second order items  
((SELECT id FROM orders WHERE total_amount = 699000 LIMIT 1), (SELECT id FROM products WHERE name = 'Halo Infinite' LIMIT 1), 1, 699000),
-- Third order items
((SELECT id FROM orders WHERE total_amount = 1598000 LIMIT 1), (SELECT id FROM products WHERE name = 'The Legend of Zelda: Tears of the Kingdom' LIMIT 1), 1, 899000),
((SELECT id FROM orders WHERE total_amount = 1598000 LIMIT 1), (SELECT id FROM products WHERE name = 'Cyberpunk 2077' LIMIT 1), 1, 699000);
*/

-- Create some indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description_search ON products USING gin(to_tsvector('english', description));

-- Update the updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add some helpful views for analytics
CREATE OR REPLACE VIEW popular_products AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.price,
    COALESCE(SUM(oi.quantity), 0) as total_sold,
    p.stock
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('paid', 'shipped', 'delivered') OR o.status IS NULL
GROUP BY p.id, p.name, p.category, p.price, p.stock
ORDER BY total_sold DESC;

CREATE OR REPLACE VIEW category_stats AS
SELECT 
    category,
    COUNT(*) as product_count,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price,
    SUM(stock) as total_stock
FROM products
GROUP BY category
ORDER BY category;

-- Insert completion message
DO $$
BEGIN
    RAISE NOTICE 'GameSphere Console Store database seeded successfully!';
    RAISE NOTICE 'Total products inserted: %', (SELECT COUNT(*) FROM products);
    RAISE NOTICE 'Products by category:';
    RAISE NOTICE '- PS5: %', (SELECT COUNT(*) FROM products WHERE category = 'PS5');
    RAISE NOTICE '- Xbox: %', (SELECT COUNT(*) FROM products WHERE category = 'Xbox');
    RAISE NOTICE '- Nintendo: %', (SELECT COUNT(*) FROM products WHERE category = 'Nintendo');
    RAISE NOTICE '- PC: %', (SELECT COUNT(*) FROM products WHERE category = 'PC');
END $$;
