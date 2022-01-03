const httpError = require('http-errors');
const { genPassword } = require('../lib/customAuth/passwordUtils');
const { wipePassword } = require('../lib/formatUtils');
const { checkUser } = require('../lib/validatorUtils');
const User = require('../models/UserModel');
const Address = require('../models/AddressModel');
const Card = require('../models/CardModel');

module.exports.getAccount = async (user_id) => {
    try {
        // check if user exists
        const user = await checkUser(user_id);
        
        // wipe password info before returning
        wipePassword(user);

        return { user };

    } catch(err) {
        throw (err);
    }
}

module.exports.putAccount = async (data) => {
    try {
        // check if user exists
        const user = await checkUser(data.user_id);

        // modify user with properties in data 
        for (const property in data) {
            if (property === "email" ||  property === "first_name" || property === "last_name") {
                // check inputs are truthy and not empty string
                if (data[property] && data[property].length > 0) {
                    user[property] = data[property];
                }
            } else if (property === "password") {
                // hash and salt password
                const pwObj = genPassword(data[property]);

                // save hash and salt to db, not password itself
                user.pw_hash = pwObj.pw_hash;
                user.pw_salt = pwObj.pw_salt;
            } else if (property === "primary_address_id") {
                // get address, if it exists 
                const address = data[property] ? await Address.findById(data[property]) : null;

                // check that address exists and address's user_id is user's id
                if(address && address.user_id === data.user_id){
                    user[property] = data[property];
                }
            } else if (property === "primary_payment_id") {
                // get payment method, if it exists 
                const payment = data[property] ? await Card.findById(data[property]) : null;
                
                // check that payment exists and payment's user_id is user's id
                if(payment && payment.user_id === data.user_id){
                    user[property] = data[property];
                }
            }
        }

        // update the user
        const updatedUser = await User.update(user);

        // wipe password info before returning
        wipePassword(updatedUser);

        // return updated user;
        return { user: updatedUser };

    } catch(err) {
        throw err;
    }
}