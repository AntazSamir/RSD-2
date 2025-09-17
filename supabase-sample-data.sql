-- Insert sample users
INSERT INTO users (id, email, full_name, role) VALUES
('11111111-1111-1111-1111-111111111111', 'manager@example.com', 'John Manager', 'manager'),
('22222222-2222-2222-2222-222222222222', 'chef@example.com', 'Sarah Chef', 'chef'),
('33333333-3333-3333-3333-333333333333', 'waiter@example.com', 'Mike Waiter', 'waiter'),
('44444444-4444-4444-4444-444444444444', 'customer@example.com', 'Jane Customer', 'customer')
ON CONFLICT (email) DO NOTHING;

-- Insert sample menu categories
INSERT INTO categories (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Appetizers', 'Starter dishes to begin your meal'),
('22222222-2222-2222-2222-222222222222', 'Main Course', 'Hearty main dishes'),
('33333333-3333-3333-3333-333333333333', 'Desserts', 'Sweet treats to finish your meal'),
('44444444-4444-4444-4444-444444444444', 'Beverages', 'Drinks and beverages')
ON CONFLICT (id) DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (id, name, description, price, category, available) VALUES
('11111111-1111-1111-1111-111111111111', 'Margherita Pizza', 'Classic pizza with tomato sauce and mozzarella', 12.99, 'Main Course', true),
('22222222-2222-2222-2222-222222222222', 'Caesar Salad', 'Fresh romaine lettuce with Caesar dressing', 8.99, 'Appetizers', true),
('33333333-3333-3333-3333-333333333333', 'Grilled Salmon', 'Fresh salmon with lemon and herbs', 18.99, 'Main Course', true),
('44444444-4444-4444-4444-444444444444', 'Chocolate Cake', 'Rich chocolate cake with vanilla ice cream', 6.99, 'Desserts', true),
('55555555-5555-5555-5555-555555555555', 'Mineral Water', 'Sparkling or still water', 2.99, 'Beverages', true),
('66666666-6666-6666-6666-666666666666', 'Chicken Pasta', 'Pasta with grilled chicken and creamy sauce', 14.99, 'Main Course', true),
('77777777-7777-7777-7777-777777777777', 'Garlic Bread', 'Toasted bread with garlic butter', 4.99, 'Appetizers', true),
('88888888-8888-8888-8888-888888888888', 'Tiramisu', 'Classic Italian dessert with coffee', 7.99, 'Desserts', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample restaurant tables
INSERT INTO restaurant_tables (id, number, capacity, status) VALUES
('11111111-1111-1111-1111-111111111111', 1, 4, 'available'),
('22222222-2222-2222-2222-222222222222', 2, 2, 'available'),
('33333333-3333-3333-3333-333333333333', 3, 6, 'occupied'),
('44444444-4444-4444-4444-444444444444', 4, 4, 'reserved'),
('55555555-5555-5555-5555-555555555555', 5, 8, 'available'),
('66666666-6666-6666-6666-666666666666', 6, 2, 'cleaning')
ON CONFLICT (id) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (id, name, email, phone, address, loyalty_points) VALUES
('11111111-1111-1111-1111-111111111111', 'John Doe', 'john@example.com', '123-456-7890', '123 Main St', 150),
('22222222-2222-2222-2222-222222222222', 'Jane Smith', 'jane@example.com', '098-765-4321', '456 Oak Ave', 220),
('33333333-3333-3333-3333-333333333333', 'Bob Johnson', 'bob@example.com', '555-123-4567', '789 Pine Rd', 75)
ON CONFLICT (id) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (id, table_id, customer_name, status, total_amount) VALUES
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'John Doe', 'confirmed', 25.98),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Jane Smith', 'pending', 12.99),
('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Bob Johnson', 'preparing', 31.97)
ON CONFLICT (id) DO NOTHING;

-- Insert sample order items
INSERT INTO order_items (id, order_id, menu_item_id, quantity, price) VALUES
('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 1, 12.99),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1, 8.99),
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 1, 12.99),
('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 1, 18.99),
('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', 1, 7.99),
('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 2, 5.98)
ON CONFLICT (id) DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory (id, name, quantity, unit, reorder_level, supplier) VALUES
('11111111-1111-1111-1111-111111111111', 'Tomato Sauce', 50, 'bottles', 10, 'Food Supplier Inc.'),
('22222222-2222-2222-2222-222222222222', 'Mozzarella Cheese', 30, 'kg', 5, 'Dairy Products Co.'),
('33333333-3333-3333-3333-333333333333', 'Salmon Fillets', 20, 'pieces', 5, 'Seafood Distributors'),
('44444444-4444-4444-4444-444444444444', 'Chocolate', 15, 'kg', 3, 'Sweet Ingredients Ltd.'),
('55555555-5555-5555-5555-555555555555', 'Pasta', 25, 'kg', 5, 'Italian Foods Co.')
ON CONFLICT (id) DO NOTHING;

-- Insert sample staff
INSERT INTO staff (id, user_id, position, hire_date, shift_start, shift_end, status) VALUES
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Head Chef', '2023-01-15', '09:00:00', '18:00:00', 'working'),
('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Waiter', '2023-03-20', '10:00:00', '19:00:00', 'working'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Manager', '2022-11-01', '08:00:00', '17:00:00', 'working')
ON CONFLICT (id) DO NOTHING;

-- Insert sample reservations
INSERT INTO reservations (id, customer_name, customer_email, customer_phone, table_id, reservation_date, reservation_time, party_size, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Alice Johnson', 'alice@example.com', '321-654-0987', '44444444-4444-4444-4444-444444444444', '2025-09-20', '19:00:00', 4, 'confirmed'),
('22222222-2222-2222-2222-222222222222', 'Bob Smith', 'bobsmith@example.com', '654-321-7890', '22222222-2222-2222-2222-222222222222', '2025-09-18', '20:00:00', 2, 'pending')
ON CONFLICT (id) DO NOTHING;

-- Insert sample payments
INSERT INTO payments (id, order_id, amount, payment_method, status) VALUES
('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 25.98, 'credit_card', 'completed'),
('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 31.97, 'cash', 'completed')
ON CONFLICT (id) DO NOTHING;