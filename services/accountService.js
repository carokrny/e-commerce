const httpError = require('http-errors');
const genPassword = require('../utils/passwordUtils').genPassword;
const UserModel = require('../models/UserModel');
const User = new UserModel();

module.exports.getAccount = async (user_id) => {
    try {

        // check if user exists
        const user = await User.findById(user_id);
        if (!user) {
            throw httpError(404, 'User not found.');
        }
        
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

        // modify user with properties in data 
        for (const property in data) {
            if (property === "email" ||  property === "first_name" || property === "last_name") {
                user[property] = data[property];
            } else if (property === "password") {
                const pwObj = genPassword(data[property]);
                user[pw_hash] = pwObj.pw_hash;
                user[pw_salt] = pwObj.pw_salt;
            }
        }

        // update the user
        const updatedUser = await User.update(user);

        // throw error if not updated 
        if (!updatedUser) {
            throw httpError(500, 'Error updating user account.');
        }

        // wipe password info before returning
        delete updatedUser.pw_hash;
        delete updatedUser.pw_salt;

        // return updated user;
        return { user: updatedUser };

    } catch(err) {
        throw err;
    }
}