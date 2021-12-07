const httpError = require('http-errors');
const UserModel = require('../models/UserModel');
const User = new UserModel();
const CartModel = require('../models/CartModel');
const Cart = new CartModel();
const CartItemModel = require('../models/CartItemModel');
const CartItem = new CartItemModel();

module.exports.postCart = async (user_id) => {
    try {
        // create a new cart
        const newCart = await Cart.create();
        
        // check that cart was created
        if (!newCart) {
            throw httpError(500, 'Server error creating cart.');
        }

        // assign cart PK as FK in user db
        const updatedUser = await User.updateCart({ id: user_id, cart_id: newCart.id });
        
        // check that user was updated
        if (!updatedUser) {
            throw httpError(404, 'User not found.');
        }

        return {
            user: updatedUser,
            cart: newCart
        }
    } catch(err) {
        throw new Error(err);
    }
}

module.exports.getCart = async (cart_id) => {
    try {
        // find cart 
        const cart = await Cart.findById(cart_id);

        // throw error if cart not found
        if (!cart) {
            throw httpError(404, 'Cart not found.')
        }

        // find all items in cart
        const cartItems = await CartItem.findInCart(cart_id);

        return {
            cart: cart, 
            cartItems: cartItems
        }
    } catch(err) {
        throw new Error(err);
    }
}
