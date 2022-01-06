const httpError = require('http-errors');
const { postAddress, getAddress } = require('./addressService');
const { postPayment, getPayment } = require('./paymentService');
const { postOrder } = require('./orderService');
const { getCart } = require('./cartService');

module.exports.postShipping = async (data) => {
    try {
        const { first_name, 
                last_name } = data;
            
        // check for valid name inputs 
        if (!first_name || !first_name.length ||
            !last_name || !last_name.length) {
                throw httpError(400, 'Invalid inputs');
        }

        var shipping = null;

        // fetch address if it already exists
        if (data.address_id) {
            shipping = await getAddress(data);
        } else {
            // otherwise create new address for shipping
            shipping = await postAddress(data);
        }
        
        // attach names to shipping address
        shipping.address.first_name = first_name;
        shipping.address.last_name = last_name;

        return { shipping: shipping.address };
        
    } catch(err) {
        throw err;
    }
}

module.exports.postPayment = async (data) => {
    try {

        // -----------Handle Billing Address----------------

        const { first_name, 
                last_name } = data;
            
        // check for valid name inputs 
        if (!first_name || !first_name.length ||
            !last_name || !last_name.length) {
                throw httpError(400, 'Invalid inputs');
        }

        var billing = null;

        // fetch address if it already exists
        if (data.address_id) {
            billing = await getAddress(data);
        } else {
            // otherwise create new address for billing
            billing = await postAddress(data);
        }

        // attach names to billing address
        billing.address.first_name = first_name;
        billing.address.last_name = last_name;

        // -------------Handle Payment Method-----------------
        
        var payment = null;

        // fetch payment if it already exists
        if (data.payment_id) {
            payment = await getPayment(data);
        } else {
            // otherwise create new payment method
            payment = await postPayment({
                ...data,
                billing_address_id: billing.address.id 
            });
        }

        // -------------Return data-----------------

        return {
            billing: billing.address,
            payment: payment.payment
        };

    } catch(err) {
        throw err;
    }
}

module.exports.getCheckoutReview = async (data) => {
    try { 
        // check for valid inputs 
        if (!data.cart_id || 
            !data.shipping_address_id ||
            !data.billing_address_id ||
            !data.payment_id||
            !data.user_id) {
                throw httpError(400, 'Invalid inputs');
            }

        // get cart
        const { cart, cartItems } = await getCart(data.cart_id);
        
        // get shipping address info 
        const shipping = await getAddress({ user_id: data.user_id, address_id: data.shipping_address_id });
        
        // get billing address info
        const billing = await getAddress({ user_id: data.user_id, address_id: data.billing_address_id });

        // get payment info
        const { payment } = await getPayment({ user_id: data.user_id, payment_id: data.payment_id });

        return {
            cart, 
            cartItems,
            shipping: shipping.address,
            billing: billing.address, 
            payment
        };

    } catch(err) {
        throw err;
    }
}

module.exports.postCheckout = async(data) => {
    try {
        // get info for checkout
        const checkout = await module.exports.getCheckoutReview(data);
        
        // attach user_id
        checkout.user_id = data.user_id;

        // create order
        return postOrder(checkout);

    } catch(err) {
        throw err;
    }
}