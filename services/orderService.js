const httpError = require('http-errors');
const Order = require('../models/OrderModel');
const OrderItem = require('../models/OrderItemModel');
const Cart = require('../models/CartModel');
const CartItem = require('../models/CartItemModel');
const User = require('../models/UserModel');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.postOrder = async (data) => {  
    try { 

        // ---------------------------------------------------------
        // ----- charge Card with payment_id using Stripe API ------
        // ---------------------------------------------------------

        /* 
         * Keep stripe section atomized to be easily repleaced with 
         * another payment processing api
         */

        // create cardToken to charge
        const cardToken = await stripe.tokens.create({
            card: {
                name: data.billing.first_name + " " + data.billing.last_name,   
                number: data.payment.card_no,
                exp_month: data.payment.exp_month,  
                exp_year: data.payment.exp_year,
                cvc: data.payment.cvv,
                address_line1: data.billing.address1,
                address_line2: data.billing.address2,
                address_city: data.billing.city,
                address_state: data.billing.state,
                address_zip: data.billing.zip,
                address_country: data.billing.country,
            }
        });
        
        // charge card with Stripe
        const charge = await stripe.charges.create({
            amount: Math.round(data.cart.total * 100),  // stripe charges in usd cents, round to avoid error
            currency: "usd",
            source: cardToken.id, 
        });

        if (!charge.status === "succeeded") {
            // throw error
            throw httpError(400, 'Error processing payment.');
        }

        // ---------------------------------------------------------
        // ----------------- end charge section --------------------
        // ---------------------------------------------------------

        // create an new order
        const newOrder = await Order.create({ 
            user_id: data.user_id,
            shipping_address_id: data.shipping.id,
            billing_address_id: data.billing.id, 
            payment_id: data.payment.id, 
            amount_charged: data.cart.total, 
            stripe_charge_id: charge.id
        });

        const { cartItems } = data;

        // iterate through cart items to create order items
        var orderItems = []; 
        for (const cartItem of cartItems) {
            // create new order item 
            const newOrderItem = await OrderItem.create({ ...cartItem, order_id: newOrder.id });
            
            // delete cart item from database
            const deletedCartItem = await CartItem.delete({ ...cartItem });

            // add item to order items
            orderItems.push(newOrderItem);
        }

        // delete cart from database
        const deletedCart = await Cart.delete(data.cart.id);

        // attach num_items to newOrder 
        newOrder.num_items = data.cart.num_items;

        return {
            order: newOrder,
            orderItems: orderItems
        }
        

    } catch(err) {
        console.error(err.stack);
        throw err;
    }
}

module.exports.getAllOrders = async (user_id) => {
    try {
        // find orders assocaited with user_id
        const orders = await Order.findByUserId(user_id);

        return { orders };

    } catch(err) {
        throw err;
    }
}

module.exports.getOneOrder = async (data) => {
    try {
        if (!data.order_id) {
            throw httpError(400, 'No order id');
        }

        // find order
        const order = await Order.findById(data.order_id);

        // throw error if order doesn't exist
        if(!order) {
            throw httpError(404, 'Order not found');
        }

        // throw error if user did not place order
        if(order.user_id !== data.user_id) {
            throw httpError(403, 'User did not place order');
        }

        // find order items
        const orderItems = await OrderItem.findInOrder(data.order_id);

        return { order, orderItems };

    } catch(err) {
        throw err;
    }
}