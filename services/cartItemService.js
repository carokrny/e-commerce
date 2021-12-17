const httpError = require('http-errors');
const CartItemModel = require('../models/CartItemModel');
const CartItem = new CartItemModel();

module.exports.postCartItem = async (data) => {
    try {
        // throw error if no cart_id
        if(!data.cart_id) {
            throw httpError(400, 'No cart identifier.');
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
        // throw error if no cart_id
        if(!data.cart_id) {
            throw httpError(400, 'No cart identifier.');
        }

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
        // throw error if no cart_id
        if(!data.cart_id) {
            throw httpError(400, 'No cart identifier.');
        }

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
        // throw error if no cart_id
        if(!data.cart_id) {
            throw httpError(400, 'No cart identifier.');
        }

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