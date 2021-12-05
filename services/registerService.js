const httpError = require('http-errors');
const genPassword = require('../utils/passwordUtils').genPassword;
const attachJWT = require('../utils/attachJWT');
const UserModel = require('../models/UserModel');
const User = new UserModel();

/**
 * Processes user registration 
 *
 * @param {Object} data contains user registration data, has email and password properties
 * @returns {Object} containing info to be sent by http response
 */
module.exports = async (data) => {
    try {
        // check for required inputs 
        const { email, password } = data;
        if (!(email && password)) {
            throw httpError(400, 'Email and password required.');
        };
        
        // pwObj contains salt and hash generated
        const pwObj = genPassword(data.password);

        // check if user already exists
        const user = await User.findByEmail(data.email);
        if (user) {
            throw httpError(409, 'Email already in use');
        };

        // create new user
        const newUser =  await User.create({
            email: data.email,              
            salt: pwObj.salt,
            hash: pwObj.hash
        });

        // attach JWT to newly created user or throw error
        if (newUser) {
            return attachJWT(newUser);
        } else {
            throw httpError(500, 'Error creating new account.');
        }

    } catch(err) {
        throw new Error(err);
    };
};