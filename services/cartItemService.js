const httpError = require('http-errors');
const CartItem = require('../models/CartItemModel');
const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');

/*
 * Helper function to validate inputs and grab cartItem
 */
const checkCartItem = async (data) => {
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

module.exports.postCartItem = async (data) => {
    try {
        // throw error if inputs invalid
        if(!data.cart_id || !data.product_id || !data.quantity || data.quantity < 0) {
            throw httpError(400, 'Invalid inputs.');
        }

        // check that cart exists
        const cart = await Cart.findById(data.cart_id);
        if(!cart) {
            throw httpError(404, 'Cart does not exist');
        }

        // check that product exists
        const product = await Product.findById(data.product_id);
        if(!product) {
            throw httpError(404, 'Product does not exist');
        } 

        // check if cart item exists already
        var cartItem = await CartItem.findOne(data);

        // if item already in cart, update quantity
        if (cartItem) {
            // update quantity of item in cart
            const updatedQuantity = cartItem.quantity + data.quantity;
            cartItem = await CartItem.update({ ...data, quantity: updatedQuantity });
        } else {
            // otherwise, create new cart item
            cartItem = await CartItem.create(data);
        }

        return { cartItem };

    } catch(err) {
        throw err;
    }
}

module.exports.getCartItem = async (data) => {
    try {
        // validate inputs and grab cart
        const cartItem = await checkCartItem(data);

        return { cartItem };

    } catch(err) {
        throw err;
    }
}

module.exports.putCartItem = async (data) => {
    try {
        // validate inputs
        await checkCartItem(data);

        // update quantity of item in cart
        const cartItem = await CartItem.update(data);

        return { cartItem };

    } catch(err) {
        throw err;
    }
}

module.exports.deleteCartItem = async (data) => {
    try {
        // validate inputs
        await checkCartItem(data);
        
        // delete cart item and return it
        const cartItem = await CartItem.delete(data);

        return { cartItem };

    } catch(err) {
        throw err;
    }
}