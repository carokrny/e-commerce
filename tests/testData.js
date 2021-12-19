/**
 * 
 * Data for running tests locally 
 * 
 * Based on data entered locally in postgres database
 * 
 */

// test registration for user that does not exist in database
 module.exports.testRegister = {
    email: 'orange@me.com', 
    password: 'purple'
 };

// login for user that does exist in database
 module.exports.testLogin = {
    email: 'mascara@me.com', 
    password: 'secret'
 };

 // user id for testLogin user 
 module.exports.userId = 21;

// sample order for testLogin user
 module.exports.testOrderId = 7;

// test product for entering into carts and orders
module.exports.product = {
    product_id: 1, 
    quantity: 2
};

// updated quantity to product for updating cart
module.exports.updatedProduct = {
    product_id: 1,
    quantity: 5
};

module.exports.userAccountPut = {
    first_name: 'Sam', 
}

module.exports.addressPost = {
    address1: '123 Easy St',
    city: 'San Francisco', 
    state: 'CA', 
    zip: '94103', 
    country: 'United States'
}

module.exports.addressPut = {
    address2: 'Apt 5'
}

// to get an error on address routes with wrong address id
module.exports.differentAddressId = 1;

// Note billing_address_id is associated with user_id = 21
 module.exports.cardPost = {
    card_type: 'debit', 
    provider: 'Visa', 
    card_no: '1234123412341234', 
    cvv: '123', 
    expiry: '2022-11-01', 
    billing_address_id: 1
 }

 module.exports.cardPut = {
    provider: 'MasterCard'
 }

 // Note billing_address_id is associated with user_id = 21
 module.exports.invalidCardPost = {
    card_type: 'debit', 
    provider: 'Visa', 
    card_no: '123412G412341234', 
    cvv: '123', 
    expiry: '2022-11-01', 
    billing_address_id: 1
 }

 module.exports.invalidCardPut = {
    cvv: '1K3',
 }

 // to get an error on payment routes with wrong payment id
module.exports.differentPaymentId = 4;




// test login 2 since tests run synchronously and carts must have unique user_id
// test login 2 is used for cartItems and address tests
 module.exports.testLogin2 = {
    email: 'john@me.com', 
    password: 'abc123'
 };

// test login 2's user ids
 module.exports.userId2 = 130;
