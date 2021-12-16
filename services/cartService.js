const httpError = require('http-errors');
const CartModel = require('../models/CartModel');
const CartItemModel = require('../models/CartItemModel');
const OrderModel = require('../models/OrderModel');
const OrderItemModel = require('../models/OrderItemModel');
const Cart = new CartModel();
const CartItem = new CartItemModel();
const Order = new OrderModel();
const OrderItem = new OrderItemModel();

module.exports.postCart = async (user_id) => {
    try {
        // create a new cart
        const cart = await Cart.create(user_id);
        
        // check that cart was created
        if (!cart) {
            throw httpError(500, 'Server error creating cart.');
        }

        return { cart }
    } catch(err) {
        throw err;
    }
}

module.exports.getCart = async (cart_id) => {
    try {
        // throw error if no cart_id
        if(!cart_id) {
            throw httpError(400, 'No cart identifier.');
        }

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
        // throw error if no cart_id
        if(!cart_id) {
            throw httpError(400, 'No cart identifier.');
        }

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

        // delete cart from database
        const deletedCart = await Cart.delete(cart_id);

        return {
            order: newOrder, 
            orderItems: orderItems,
        };
        
    } catch(err) {
        throw err;
    }
}
