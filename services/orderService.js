const httpError = require('http-errors');
const OrderModel = require('../models/OrderModel');
const Order = new OrderModel();

module.exports.getAllOrders = async (user_id) => {
    try {
        const orders = await Order.findByUserId(user_id);

        if(!orders) {
            throw httpError(404, 'User has not placed any orders');
        }

        return orders;

    } catch(err) {
        throw new Error(err);
    }
}

module.exports.getOneOrder = async (data) => {
    try {
        const order = await Order.findById(data.order_id);

        if(!order) {
            throw httpError(404, 'Order not found');
        }

        if(order.user_id !== data.user_id) {
            throw httpError(403, 'User did not place order');
        }

        return order;

    } catch(err) {
        throw new Error(err);
    }
}