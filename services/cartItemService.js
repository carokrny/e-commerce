const httpError = require('http-errors');
const { validateCartItem, 
    validateCartItemInputs } = require('../lib/validatorUtils');
const { postCart } = require('./cartService');
const CartItem = require('../models/CartItemModel');
const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');

module.exports.postCartItem = async (data) => {
    try {
        // throw error if inputs invalid
        validateCartItemInputs(data);

        // check that product exists
        const product = await Product.findById(data.product_id);
        if(!product) {
            throw httpError(404, 'Product does not exist');
        } 

        // create a cart if one does not exist
        if (!data.cart_id) {
            const { cart, cartItems } = await postCart(data.user_id);
            data.cart_id = cart.id;
        }

        // grab cartItem, if it already exists in cart
        let cartItem = await CartItem.findOne(data);
        
        if (cartItem) {
            // if item already in cart, update quantity
            let updatedQuantity = cartItem.quantity + data.quantity;
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
        const cartItem = await validateCartItem(data);

        return { cartItem }; 
    } catch(err) {
        throw err;
    }
}

module.exports.putCartItem = async (data) => {
    try {
        // validate inputs
        await validateCartItem(data);

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
        await validateCartItem(data);
        
        // delete cart item and return it
        const cartItem = await CartItem.delete(data);

        // check if cart is empty 
        const remainingItems = await CartItem.findInCart(data.cart_id);

        if(!remainingItems) {
            await Cart.delete(data.cart_id);
            cartItem.cart_id = null;
        }

        return { cartItem }; 
    } catch(err) {
        throw err;
    }
}