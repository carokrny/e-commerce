const httpError = require('http-errors');
const Cart = require('../models/CartModel');
const CartItem = require('../models/CartItemModel');
const { validateID, 
    validateNullableID } = require('../lib/validatorUtils');

module.exports.postCart = async (user_id) => {
    try {
        // validate inputs 
        validateNullableID(user_id);

        // create a new cart
        const cart = await Cart.create(user_id);
        
        // check that cart was created
        if (!cart) {
            throw httpError(500, 'Server error creating cart.');
        }

        return { 
            cart: cart, 
            cartItems: [] 
        }
    } catch(err) {
        throw err;
    }
}

module.exports.getCart = async (cart_id, user_id) => {
    try {
        let cart; 

        if (cart_id === null) {
            if (user_id === null) {
                throw httpError(404, 'Cart not found.')
            } else {
                // validate inputs
                validateID(user_id)

                // find cart by user_id
                cart = await Cart.findByUserId(user_id);
            }
        } else {
            // validate inputs
            validateID(cart_id);

            // find cart by on cart_id
            cart = await Cart.findById(cart_id);
        }

        // if no cart found
        if (!cart) {
            throw httpError(404, 'Cart not found.')
        }

        // find all items in cart
        const cartItems = await CartItem.findInCart(cart_id);

        if (!cartItems) {
            throw httpError(404, 'Cart empty.')
        }

        return {
            cart: cart, 
            cartItems: cartItems
        }
    } catch(err) {
        throw err;
    }
}

module.exports.deleteCart = async (cart_id) => {
    try {
        // validate inputs
        validateID(cart_id);

        // verify cart is empty
        const cartItems = await CartItem.findInCart(cart_id);
        if (cartItems) {
            throw httpError(405, 'Cart not empty.')
        }

        // delete cart by cart_id
        const cart = await Cart.delete(cart_id);

        // if no cart found
        if (!cart) {
            throw httpError(404, 'Cart not found.')
        }
        
        return {
            cart: cart,
            cart_items: []
        }
    } catch(err) {
        throw err;
    }
}