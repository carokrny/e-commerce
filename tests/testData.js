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
    password: 'purple',
 };

// login for user that does exist in database
 module.exports.user= {
    email: 'mascara@me.com', 
    password: 'secret',
    id: 21,
    order_id: 7
 };

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
    country: 'United States', 
    isPrimaryAddress: false
}

module.exports.addressPut = {
    address2: 'Apt 5', 
    isPrimaryAddress: true
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
    billing_address_id: 1, 
    isPrimaryPayment: false,
 }

 module.exports.cardPut = {
    provider: 'MasterCard', 
    isPrimaryPayment: true
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
    card_no: '12341234123412K3'
 }

 // to get an error on payment routes with wrong payment id
module.exports.differentPaymentId = 162;




// test login 2 since tests run synchronously and carts must have unique user_id
// test login 2 is used for cartItems and address tests
 module.exports.user2 = {
    email: 'john@me.com', 
    password: 'abc123', 
    id: 130
 };



// test login 3 since tests run synchronously and carts must have unique user_id
// test login 3 is used for checkout tests
 module.exports.user3 = {
    email: 'arugula@me.com', 
    password: 'lettuce', 
    id: 198, 
    first_name: 'Arugula', 
    last_name: 'Salad'
 };



// test login 4 since tests run synchronously and carts must have unique user_id
// test login 4 is used for checkout tests
 module.exports.user4 = {
    email: 'coffee@me.com', 
    password: 'sugarAndCream', 
    id: 592,
    first_name: 'Coffee', 
    last_name: 'Cup'
 };



// test login 5 since tests run synchronously and carts must have unique user_id
// test login 5 is used for checkout tests
 module.exports.user5 = {                    
    email: 'turkey@me.com', 
    password: 'stuffing', 
    id: 892,
    first_name: 'Turkey', 
    last_name: 'Dinner'
 };



 // test login 6 since tests run synchronously and carts must have unique user_id
// test login 6 is used for checkout tests
 module.exports.user6 = {                   
    email: 'pumpkin@me.com', 
    password: 'orangeAndRound', 
    id: 893,
    first_name: 'Pumpkin', 
    last_name: 'Pie', 
    primary_address_id: 492, 
    primary_payment_id: 299
 };



 // test registration for user that does not exist in database
 // for checkout tests
 module.exports.testRegister2 = {
    email: 'yellow@me.com', 
    password: 'cyanOrTeal',
    first_name: 'Yellow',
    last_name: 'Color'
 };