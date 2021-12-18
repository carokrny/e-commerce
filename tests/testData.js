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
    address1: '123 Easy St',
    address2: 'Apt 5',
    city: 'San Francisco', 
    state: 'CA', 
    zip: '94103', 
    country: 'United States'
}

// test login 2 since tests run synchronously and carts must have unique user_id
// test login 2 is used for cartItems and address tests
 module.exports.testLogin2 = {
    email: 'john@me.com', 
    password: 'abc123'
 };

// test login 2's user ids
 module.exports.userId2 = 130;

 module.exports.differentAddressId = 1;