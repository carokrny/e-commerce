const httpError = require('http-errors');
const genPassword = require('../utils/passwordUtils').genPassword;
const UserModel = require('../models/UserModel');
const User = new UserModel();

module.exports = async (data) => {
    try {
        // pwObj contains salt and hash generated
        const pwObj = genPassword(data.password);

        // check if user already exists
        const user = await User.findByEmail(data.email);
        if (user) {
            throw httpError(409, 'Email already in use');
        }

        return await User.create({
            email: data.email,              // !! NTS - figure out how to add optional first/last name later. 
            salt: pwObj.salt,
            hash: pwObj.hash
        });

    } catch(err) {
        throw new Error(err);
    };
};