const httpError = require('http-errors');
const genPassword = require('../utils/passwordUtils').genPassword;
const UserModel = require('../models/UserModel');
const User = new UserModel();

module.exports = async (data, user_id) => {
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

        // send updated user to database
        return User.update(user);

    } catch(err) {
        throw new Error(err);
    }
}