const httpError = require('http-errors');
const Card = require('../models/CardModel');
const User = require('../models/UserModel');

/**
 * Helper function to check that:
 *      - valid input provided
 *      - payment method exists
 *      - payment method is associated with authenticated user
 * Otherwise throws error
 *
 * @param {Object} data data about payment method and user
 * @return {object} payment method
 */
const checkPayment = async (data) => {
    try {
        // check for valid input
        if (!data.payment_id) {
            throw httpError(400, 'Missing payment id');
        }

        // find payment by id
        const payment = await Card.findById(data.payment_id);
        if (!payment) {
            throw httpError(404, 'Payment not found.');
        }

        // check that payment method's user_id matches authenticated user_id
        if (payment.user_id !== data.user_id) {
            throw httpError(409, 'Payment does not match user.')
        }

        return payment;

    } catch(err) {
        throw err;
    }
}

/**
 * Helper function to check that every char in a string is a num
 * 
 * @param {String} str
 * @return {bool} True if each char is num
*/
const eachCharIsNum = (str) => {
    const charCodeZero = "0".charCodeAt(0);
    const charCodeNine = "9".charCodeAt(0);

    for(let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode < charCodeZero || charCode > charCodeNine) {
            return false;
        }
    }
    return true;
}

module.exports.postPayment = async (data) => {
    try {  
        const { card_type,  // can be empty
                provider,   
                card_no, 
                cvv,
                expiry,
                billing_address_id,
                user_id } = data;

        // check for valid inputs 
        if (provider === null            || provider.length === 0    || 
            card_no === null             || card_no.length !== 16    ||
            cvv === null                 || cvv.length !== 3         ||
            expiry === null              || expiry.length !== 10     ||
            billing_address_id === null  ||
            user_id === null             ||
            !eachCharIsNum(card_no)      || !eachCharIsNum(cvv)
            ) {
                throw httpError(400, 'Invalid inputs');
        }

        // create payment
        const payment = await Card.create(data);

        return { payment };

    } catch(err) {
        throw err;
    }
}

module.exports.getPayment = async (data) => {
    try {
        const payment = await checkPayment(data);

        return { payment };

    } catch(err) {
        throw(err)
    }
}

module.exports.putPayment = async (data) => {
    try {
        const payment = await checkPayment(data);

        // modify payment with properties in data 
        for (const property in data) {
            if (property === "card_type" ||  
                property === "provider" || 
                property === "expiry" ||
                property === "billing_address_id") {
                // check that value is truthy not an empty string
                if (data[property] && data[property].toString().length > 0) {
                    payment[property] = data[property];
                }
            } else if (property === "card_no" && 
                data[property] && 
                data[property].length === 16 &&
                eachCharIsNum(data[property])) {
                payment[property] = data[property];
            } else if (property === "cvv" && 
                data[property] && 
                data[property].length === 3 &&
                eachCharIsNum(data[property])) {
                payment[property] = data[property];
            }
        }

        // update payment 
        const updatedPayment = await Card.update(payment);
        
        return { payment: updatedPayment };

    } catch(err) {
        throw err;
    }
}

module.exports.deletePayment = async (data) => {
    try {
        await checkPayment(data);

        // check if payment is primary payment of user
        const user = await User.findById(data.user_id);
        if (user.primary_payment_id === parseInt(data.payment_id)) {
            // if so, update primary_payment_id to be null
            await User.update({ ...user, primary_payment_id: null });
        }

        // delete payment method
        const deletedPayment = await Card.delete(data.payment_id);
        
        return { payment: deletedPayment };

    } catch(err) {
        throw(err)
    }
}

module.exports.getAllPayments = async (user_id) => {
    try {
        // find payment methods assocaited with user_id
        const payments = await Card.findByUserId(user_id);

        return { payments };

    } catch(err) {
        throw err;
    }
}