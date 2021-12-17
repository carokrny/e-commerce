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

 // second test registration for user that does not exist in database
 module.exports.testRegister2 = {
    email: 'arugula@me.com', 
    password: 'lettuce'
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
    address1: '643 Minna St',
    address2: 'Apt 3',
    city: 'San Francisco', 
    state: 'CA', 
    zip: '94103', 
    country: 'United States'
}



// test login 2 since tests run synchronously and carts must have unique user_id
// test login 2 is used for cartItems 
 module.exports.testLogin2 = {
    email: 'john@me.com', 
    password: 'abc123'
 };