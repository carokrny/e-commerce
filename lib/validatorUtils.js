const httpError = require('http-errors');
const validator = require('validator');
const User = require('../models/UserModel');
const Address = require('../models/AddressModel');
const CartItem = require('../models/CartItemModel');
const Card = require('../models/CardModel');

/**
 * Helper functions for checking inputs
 *
 */

 /** 
 * Validator function for User services:
 *      - validate inputs
 *      - get user object 
 * Throws errors if not 
 * 
 * @param {Integer} user_id ID of user to get
 * @return {Object} user object
 */
module.exports.checkUser = async (user_id) => {
    try {
        // throw error if inputs invalid
        if(!user_id) {
            throw httpError(400, 'Invalid inputs.');
        }

        // check if user exists
        const user = await User.findById(user_id);

        // throw error if user does not exist
        if (!user) {
            throw httpError(404, 'User not found.');
        }

        return user;

    } catch(err) {
        throw err;
    }
}


/**
 * Validator function for Address services:
 *      - valid input provided
 *      - address exists
 *      - address is associated with authenticated user
 * Otherwise throws error
 *
 * @param {Object} data data about address and user
 * @return {object} address
 */
module.exports.checkAddress = async (data) => {
    try {
        // check for valid input
        if (!data.address_id) {
            throw httpError(400, 'Missing address id');
        }

        // find address by id
        const address = await Address.findById(data.address_id);
        if (!address) {
            throw httpError(404, 'Address not found.');
        }

        // check that address's user_id matches authenticated user_id
        if (address.user_id !== data.user_id) {
            throw httpError(403, 'Address does not match user.')
        }

        return address;

    } catch(err) {
        throw err;
    }
}


/**
 * Validator function for payment services:
 *      - valid input provided
 *      - payment method exists
 *      - payment method is associated with authenticated user
 * Otherwise throws error
 *
 * @param {Object} data data about payment method and user
 * @return {object} Card object that is payment method
 */
module.exports.checkPayment = async (data) => {
    try {
        // check for valid input
        if (!data.payment_id) {
            throw httpError(400, 'Missing payment id');
        }

        // find payment by id
        const payment = await Card.findById(data.payment_id);
        if (!payment) {
            throw httpError(404, 'Payment not found.');
        }

        // check that payment method's user_id matches authenticated user_id
        if (payment.user_id !== data.user_id) {
            throw httpError(409, 'Payment does not match user.')
        }

        return payment;

    } catch(err) {
        throw err;
    }
}


/** 
 * Validator function for CartItem:
 *      - validate inputs
 *      - get cartItem object 
 * Throws errors if not 
 * 
 * @param {Object} data data about cartItem
 * @return {Object} cartItem object
 */
module.exports.checkCartItem = async (data) => {
    try {
        // throw error if inputs invalid
        if(!data.cart_id || !data.product_id) {
            throw httpError(400, 'Invalid inputs.');
        }

        // find cart item
        const cartItem = await CartItem.findOne(data);
        
        // throw error if not found
        if (!cartItem) {
            throw httpError(404, 'Cart item not found');
        }

        return cartItem;
        
    } catch(err) {
        throw err;
    }
}


// ------- non-async helper functions ----------------------------------

/**
 * Helper function to check that Auth inputs are valid:
 *      - valid inputs provided
 *      - email is email format
 *      - password is valid
 * Otherwise throws error
 *
 * @param {String} email email address of user
 * @param {String} password password of user
 */
module.exports.checkAuthInputs = (email, password) => {
    if (email === null || 
        password === null ||
        !validator.isEmail(email) ||
        //!validator.isStrongPassword(password) ||
        password.length === 0) {
        throw httpError(400, 'Email and password required.');
    }
}


/**
 * Helper function to check that every char in a string is a num
 * 
 * @param {String} str
 * @return {bool} True if each char is num
*/
module.exports.eachCharIsNum = (str) => {
    const charCodeZero = "0".charCodeAt(0);
    const charCodeNine = "9".charCodeAt(0);

    for(let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode < charCodeZero || charCode > charCodeNine) {
            return false;
        }
    }
    return true;
}