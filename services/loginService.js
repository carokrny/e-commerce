const httpError = require('http-errors');
const validPassword = require('../utils/passwordUtils').validPassword;
const attachJWT = require('../utils/attachJWT');
const UserModel = require('../models/UserModel');
const User = new UserModel();

/**
 * Processes user login 
 *
 * @param {Object} data contains login data, has email and password properties
 * @returns {Object} containing info to be sent by http response
 */
module.exports = async (data) => {
    try {
        // check for required inputs 
        const { email, password } = data;
        if (email === null || password === null || email.length === 0 || password.length === 0) {
            throw httpError(400, 'Email and password required.');
        };
        
        // check if user already exists
        const user = await User.findByEmail(data.email);

        // if no user throw error 
        if (!user) {
            throw httpError(401, 'Incorrect email or password.');
        };

        // validate password
        const isValid = validPassword(data.password, user.pw_hash, user.pw_salt);

        // attach JWT if password is valid 
        if (isValid) {
            return attachJWT(user);
        } else {
            throw httpError(401, 'Incorrect email or password.');
        }
    } catch(err) {
        throw err;
    };
};