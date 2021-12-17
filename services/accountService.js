const httpError = require('http-errors');
const genPassword = require('../lib/passwordUtils').genPassword;
const User = require('../models/UserModel');
const Address = require('../models/AddressModel');

module.exports.getAccount = async (user_id) => {
    try {

        // check if user exists
        const user = await User.findById(user_id);
        if (!user) {
            throw httpError(404, 'User not found.');
        }

        // check user address in Address db, if it exists 
        const address = user.address_id ? await Address.findById(user.address_id) : null;

        // attach address to user
        user.address = address;
        
        // wipe password info before returning
        delete user.pw_hash;
        delete user.pw_salt;

        return { user };

    } catch(err) {
        throw (err);
    }
}

module.exports.updateAccount = async (data, user_id) => {
    try {

        // check if user exists
        const user = await User.findById(user_id);
        if (!user) {
            throw httpError(404, 'User not found.');
        }

        // check user address in Address db, if it exists 
        var address = user.address_id ? await Address.findById(user.address_id) : null;

        // modify user and address with properties in data 
        for (const property in data) {
            if (property === "email" ||  property === "first_name" || property === "last_name") {
                user[property] = data[property];
            } else if (property === "password") {
                const pwObj = genPassword(data[property]);
                user.pw_hash = pwObj.pw_hash;
                user.pw_salt = pwObj.pw_salt;
            } else if (property === "address1" || 
                        property === "address2" || 
                        property === "city" || 
                        property === "state" || 
                        property === "zip" || 
                        property === "country") {
                // create an address if one doesn't exist 
                if (!address) {
                    address = await Address.create();
                    // throw error if there's an error creating address
                    if (!address) {
                        httpError(500, 'Error creating address.');
                    }
                    // update user address_id FK
                    user.address_id = address.id;
                }
                address[property] = data[property];
            }
        }

        // update the address, if there is an address
        const updatedAddress = address ? await Address.update(address) : null;

        // update the user
        const updatedUser = await User.update(user);

        // throw error if not updated 
        if (!updatedUser) {
            throw httpError(500, 'Error updating user account.');
        }

        // attach address to user
        updatedUser.address = updatedAddress;

        // wipe password info before returning
        delete updatedUser.pw_hash;
        delete updatedUser.pw_salt;

        // return updated user;
        return { user: updatedUser };

    } catch(err) {
        throw err;
    }
}