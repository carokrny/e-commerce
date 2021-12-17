const httpError = require('http-errors');
const Order = require('../models/OrderModel');
const OrderItem = require('../models/OrderItemModel');

module.exports.getAllOrders = async (user_id) => {
    try {
        // find orders assocaited with user_id
        const orders = await Order.findByUserId(user_id);

        // throw error if no orders
        if(!orders) {
            throw httpError(404, 'User has not placed any orders');
        }

        return { orders };

    } catch(err) {
        throw err;
    }
}

module.exports.getOneOrder = async (data) => {
    try {
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