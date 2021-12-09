const httpError = require('http-errors');
const UserModel = require('../models/UserModel');
const CartModel = require('../models/CartModel');
const CartItemModel = require('../models/CartItemModel');
const OrderModel = require('../models/OrderModel');
const OrderItemModel = require('../models/OrderItemModel');
const Cart = new CartModel();
const CartItem = new CartItemModel();
const User = new UserModel();
const Order = new OrderModel();
const OrderItem = new OrderItemModel();

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
        throw err;
    }
}

module.exports.getCart = async (cart_id) => {
    try {
        // throw error if cart not found 
        const cart = await Cart.findById(cart_id);
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
        throw err;
    }
}

module.exports.getCheckout = async (user_id, cart_id) => {
    try {
        // throw error if cart not found
        const cart = await Cart.findById(cart_id);        
        if (!cart) {
            throw httpError(404, 'Cart not found.')
        }

        // find all items in cart
        const cartItems = await CartItem.findInCart(cart_id);
        if (!cartItems) {
            throw httpError(404, 'Cart empty.')
        }

        // create an new order
        const newOrder = await Order.create(user_id);
        if (!newOrder) {
            throw httpError(400, 'Unable to create order');
        }

        // iterate through cart items to create order items
        var orderItems = [];
        for (const cartItem of cartItems) {

            // create new order item 
            const newOrderItem = await OrderItem.create({ ...cartItem, order_id: newOrder.id });
            
            // throw error if new order item not created
            if (!newOrderItem) {
                throw httpError(400, 'Unable to process order items');
            } else {

                // delete cart item from database
                const deletedCartItem = await CartItem.delete({ ...cartItem, cart_id: cart_id });
                if (!deletedCartItem) {
                    throw httpError(500, 'Unable to remove cart items');
            }

                // add item to order items
                orderItems.push(newOrderItem);
            }
        }

        // update user cart to be null 
        const updatedUser = await User.updateCart({ id: user_id, cart_id: null });

        // delete cart deom database
        const deletedCart = await Cart.delete(cart_id);

        return {
            order: newOrder, 
            orderItems: orderItems,
            user: updatedUser
        };
        
    } catch(err) {
        throw err;
    }
}
