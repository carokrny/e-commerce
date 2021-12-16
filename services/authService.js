const httpError = require('http-errors');
const { genPassword, validPassword } = require('../lib/passwordUtils');
const attachJWT = require('../lib/attachJWT');
const UserModel = require('../models/UserModel');
const User = new UserModel();

module.exports.register = async (data) => {
    try {
        // check for required inputs 
        const { email, password } = data;
        if (email === null || password === null || email.length === 0 || password.length === 0) {
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
        throw err;
    };
};

module.exports.login = async (data) => {
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
