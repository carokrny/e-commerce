-- *********************** TEST DATA ***********************************
-- ************** Not currently being used !! **************************
-- ************* using initTestData.js instead *************************
 
INSERT INTO products (id, name, price, description, in_stock, category)
VALUES (1, 'T-Shirt', 19.99, 'Pima cotton unisex t-shirt', true, 'tops'), 
        (2, 'Pants', 39.99, 'Fitted twill pants', true, 'bottoms'), 
        (3, 'Jacket', 54.99, 'Structured jacket for layering', false, 'tops');

INSERT INTO carts (id, user_id) 
VALUES (8, 126);

INSERT INTO cart_items (cart_id, product_id, quantity) 
VALUES (8, 1, 2), 
        (8, 2, 3);

INSERT INTO addresses (id, address1, address2, city, state, zip, country, user_id, first_name, last_name) 
VALUES (1, '643 Minna St', 'Apt 3', 'San Francisco', 'CA', '94103', 'United States', 21, 'Sam', 'Mister'),
        (228, '123 Easy St', 'Apt 1', 'Springfield', 'IL', '11111', 'United States', 21, 'Sam', 'Mister'),
        (229, '40 Main St', 'Apt 6', 'San Francisco', 'CA', '94103', 'United States', 126, 'Blue', 'Blur'),
        (492, '123 Easy St', null, 'San Francisco', 'CA', '94103', 'United States', 893, 'Pumpkim', 'Pie');

INSERT INTO cards (id, user_id, provider, card_no, card_type, cvv, billing_address_id, exp_month, exp_year) 
VALUES (160, 21, 'Mastercard', '5555555555554444', 'credit', '567', 228, 5, 2024), 
        (161, 21, 'Visa', '4000056655665556', 'debit', '789', 228, 7, 2024),
        (162, 126, 'Mastercard', '5200828282828210', 'debit', '345', 229, 12, 2024),
        (299, 893, 'Visa', '4242424242424242', 'credit', '123', 492, 1, 2025);

INSERT INTO orders (id, user_id, status, shipping_address_id, billing_address_id, payment_id, amount_charged, stripe_charge_id)
VALUES (7, 21, 'pending', 1, 1, 160, 279.91, 'test'), 
        (12, 21, 'pending', 1, 1, 161, 39.98, 'test');

INSERT INTO order_items (order_id, product_id, quantity) 
VALUES (7, 1, 2),
        (7, 2, 5), 
        (12, 1, 2);

UPDATE users 
SET primary_address_id = 492, primary_payment_id = 299,
WHERE id = 893;