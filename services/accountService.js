const httpError = require('http-errors');
const { genPassword } = require('../lib/customAuth/passwordUtils');
const { wipePassword } = require('../lib/formatUtils');
const { validateUser, 
    validateName, 
    validateEmail,
    validatePassword,
    validateID } = require('../lib/validatorUtils');
const User = require('../models/UserModel');
const Address = require('../models/AddressModel');
const Card = require('../models/CardModel');

module.exports.getAccount = async (user_id) => {
    try {
        // validate inputs 
        validateID(user_id);

        // check if user exists
        const user = await validateUser(user_id);
        
        // wipe password info before returning
        wipePassword(user);

        return { user };

    } catch(err) {
        throw (err);
    }
}

module.exports.putAccount = async (data) => {
    try {
        // validate user id
        validateID(data.user_id);

        // check if user exists
        const user = await validateUser(data.user_id);

        // validate properties in data and modify user 
        for (const property in data) {
            if (property === "first_name" || property === "last_name") {
                validateName(data[property]);
                user[property] = data[property];
            } else if (property === "email") {
                validateEmail(data[property]);
                user[property] = data[property];
            } else if (property === "password") {
                validatePassword(data[property]);
                // hash and salt password
                const pwObj = await genPassword(data[property]);

                // save hash and salt to db, not password itself
                user.pw_hash = pwObj.hash;
                user.pw_salt = pwObj.salt;
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