const httpError = require('http-errors');
const { checkPayment, eachCharIsNum, expDateIsValid } = require('../lib/validatorUtils');
const { attachIsPrimaryPayment } = require('../lib/formatUtils');
const Card = require('../models/CardModel');
const User = require('../models/UserModel');

module.exports.postPayment = async (data) => {
    try {  
        const { card_type,  // can be empty
                provider,   
                card_no, 
                cvv,
                exp_month,
                exp_year,
                billing_address_id,
                isPrimaryPayment,
                user_id } = data;

        // check for valid inputs 
        if (provider === null            || provider.length === 0    || 
            card_no === null             || card_no.length !== 16    ||
            cvv === null                 || cvv.length !== 3         ||
            exp_month === null           ||  
            exp_year === null            ||
            billing_address_id === null  ||
            user_id === null             ||
            !eachCharIsNum(card_no)      || 
            !eachCharIsNum(cvv)          ||
            !expDateIsValid(exp_month, exp_year)
            ) {
                throw httpError(400, 'Invalid inputs');
        }

        // create payment
        const payment = await Card.create(data);

        // if isPrimaryPayment, update User
        if (isPrimaryPayment) {
            // primary payment stored in User to prevent conflict
            await User.updatePrimaryPaymentId({ id: user_id, primary_payment_id: payment.id });
        }

        // attach isPrimaryPayment 
        payment.isPrimaryPayment = isPrimaryPayment ? isPrimaryPayment : false;

        return { payment };

    } catch(err) {
        throw err;
    }
}

module.exports.getPayment = async (data) => {
    try {
        const payment = await checkPayment(data);

        // primary payment stored in User to prevent conflict
        const { primary_payment_id } = await User.findById(data.user_id);

        // add boolean property indicating whether address is primary address
        attachIsPrimaryPayment(payment, primary_payment_id);

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
            if ((property === "card_type"    ||  
                property === "provider"     || 
                property === "billing_address_id") &&
                data[property] &&
                data[property].toString().length > 0) {
                    payment[property] = data[property];
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
            } else if (property === "exp_month" && 
                data[property] &&
                expDateIsValid(data[property], data.exp_year || payment.exp_year)) {
                    payment[property] = data[property];                  
            } else if (property === "exp_year" && 
                data[property] &&
                expDateIsValid(data.exp_month || payment.exp_month, data[property])) {
                    payment[property] = data[property];     
            }
        }

        // update payment 
        const updatedPayment = await Card.update(payment);

        // attach boolean property indicating whether payment is primary payment method
        if (data.isPrimaryPayment) {
            // update User if true
            await User.updatePrimaryPaymentId({ id: data.user_id, primary_payment_id: updatedPayment.id });
            updatedPayment.isPrimaryPayment = true;

        } else {
            updatedPayment.isPrimaryPayment = false;
        }
  
        return { payment: updatedPayment };

    } catch(err) {
        throw err;
    }
}

module.exports.deletePayment = async (data) => {
    try {
        const payment = await checkPayment(data);

        // grab user assocaited with payment
        const { primary_payment_id } = await User.findById(data.user_id);

        // attach info if payment is primary payment method
        attachIsPrimaryPayment(payment, primary_payment_id);

        // check if payment is primary payment method of user
        if (payment.isPrimaryPayment) {
            // if so, update primary_payment_id to be null
            await User.updatePrimaryPaymentId({ id: data.user_id, primary_payment_id: null });
        }

        // delete payment method
        const deletedPayment = await Card.delete(data.payment_id);

        // add boolean property indicating whether payment is primary payment
        attachIsPrimaryPayment(deletedPayment, primary_payment_id);

        return { payment: deletedPayment };

    } catch(err) {
        throw(err)
    }
}

module.exports.getAllPayments = async (user_id) => {
    try {
        // find payment methods assocaited with user_id
        const payments = await Card.findByUserId(user_id);

        // primary payment stored in User to prevent conflict
        const { primary_payment_id } = await User.findById(user_id);

        // add boolean property indicating whether payment is primary payment
        payments.forEach(payment => {
            attachIsPrimaryPayment(payment, primary_payment_id);
        });

        return { payments };

    } catch(err) {
        throw err;
    }
}