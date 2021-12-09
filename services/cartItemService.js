const httpError = require('http-errors');
const CartItemModel = require('../models/CartItemModel');
const CartItem = new CartItemModel();

module.exports.postCartItem = async (data) => {
    try {
        // check if cart item exists already
        var cartItem = await CartItem.findOne(data);

        // if so, allow user to add item again and update quantity
        if (cartItem) {
            // update quantity of item in cart
            const updatedQuantity = cartItem.quantity + data.quantity;
            cartItem = await CartItem.update({ ...data, quantity: updatedQuantity });
        } else {
            // otherwise, create new cart item
            cartItem = await CartItem.create(data);
        }

        // throw error if not found
        if (!cartItem) {
            throw httpError(404, 'Cart item not found');
        }

        return { cartItem };

    } catch(err) {
        throw err;
    }
}

module.exports.getCartItem = async (data) => {
    try {
        // find cart item
        const cartItem = await CartItem.findOne(data);
        
        // throw error if not found
        if (!cartItem) {
            throw httpError(404, 'Cart item not found');
        }

        return { cartItem };

    } catch(err) {
        throw err;
    }
}

module.exports.putCartItem = async (data) => {
    try {
        // update quantity of item in cart
        const cartItem = await CartItem.update(data);

        // throw error if not found
        if (!cartItem) {
            throw httpError(404, 'Cart item not found');
        }

        return { cartItem };

    } catch(err) {
        throw err;
    }
}

module.exports.deleteCartItem = async (data) => {
    try {
        // delete cart item and return it
        const cartItem = await CartItem.delete(data);

        // throw error if not found
        if (!cartItem) {
            throw httpError(404, 'Cart item not found');
        }

        return { cartItem };

    } catch(err) {
        throw err;
    }
}