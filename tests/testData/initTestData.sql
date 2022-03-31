-- *********************** TEST DATA ***********************************
-- ************** Not currently being used !! **************************
-- ************* using initTestData.js instead *************************
 
INSERT INTO products (id, name, price, description, quantity, category)
VALUES (1, 'T-Shirt', 19.99, 'Pima cotton unisex t-shirt', 1000, 'tops'), 
        (2, 'Pants', 39.99, 'Fitted twill pants', 1000, 'bottoms'), 
        (3, 'Jacket', 54.99, 'Structured jacket for layering', 1000, 'tops');

INSERT INTO carts (id, user_id) 
VALUES (1, 2);

INSERT INTO cart_items (cart_id, product_id, quantity) 
VALUES (1, 1, 2), 
        (1, 2, 3);

INSERT INTO addresses (id, address1, address2, city, state, zip, country, user_id, first_name, last_name) 
VALUES (1, '643 Minna St', 'Apt 3', 'San Francisco', 'CA', '94103', 'United States', 1, 'Sam', 'Mister'),
        (2, '123 Easy St', 'Apt 1', 'Springfield', 'IL', '11111', 'United States', 1, 'Sam', 'Mister'),
        (3, '40 Main St', 'Apt 6', 'San Francisco', 'CA', '94103', 'United States', 2, 'Blue', 'Blur'),
        (4, '123 Easy St', null, 'San Francisco', 'CA', '94103', 'United States', 7, 'Pumpkim', 'Pie');

INSERT INTO cards (id, user_id, provider, card_no, card_type, cvv, billing_address_id, exp_month, exp_year) 
VALUES (1, 1, 'Mastercard', '5555555555554444', 'credit', '567', 1, 5, 2024), 
        (1, 1, 'Visa', '4000056655665556', 'debit', '789', 1, 7, 2024),
        (1, 2, 'Mastercard', '5200828282828210', 'debit', '345', 3, 12, 2024),
        (1, 7, 'Visa', '4242424242424242', 'credit', '123', 492, 4, 2025);

INSERT INTO orders (id, user_id, status, shipping_address_id, billing_address_id, payment_id, amount_charged, stripe_charge_id)
VALUES (1, 1, 'pending', 1, 1, 1, 279.91, 'test'), 
        (2, 1, 'pending', 1, 1, 2, 39.98, 'test');

INSERT INTO order_items (order_id, product_id, quantity) 
VALUES (1, 1, 2),
        (1, 2, 5), 
        (2, 1, 2);

UPDATE users 
SET primary_address_id = 4, primary_payment_id = 4,
WHERE id = 7;