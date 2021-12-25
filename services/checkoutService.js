const httpError = require('http-errors');
const { postAddress, getAddress } = require('./addressService');
const { postPayment, getPayment } = require('./paymentService');
const { postOrder } = require('./orderService');

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
        shipping.first_name = first_name;
        shipping.last_name = last_name;

        return { shipping };
        
    } catch(err) {
        throw err;
    }
}

module.exports.postCheckout = async (data) => {
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
            // otherwise create new address for shipping
            billing = await postAddress(data);
        }

        // attach names to shipping address
        billing.first_name = first_name;
        billing.last_name = last_name;

        data.billing = billing;

        // -------------Handle Payment Method-----------------
        
        var payment = null;

        // fetch payment if it already exists
        if (data.payment_id) {
            payment = await getPayment(data);
        } else {
            // otherwise create new address for shipping
            payment = await postPayment({
                ...data,
                billing_address_id: data.billing.address.id 
            });
        }

        data.payment = payment.payment;

        // -------------Handle Order Creation-----------------

        return postOrder(data);

    } catch(err) {
        throw err;
    }
}