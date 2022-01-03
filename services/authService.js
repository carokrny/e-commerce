const httpError = require('http-errors');
const attachJWT = require('../lib/customAuth/attachJWT');
const { genPassword, validPassword } = require('../lib/customAuth/passwordUtils');
const { wipePassword } = require('../lib/formatUtils');
const { checkAuthInputs } = require('../lib/validatorUtils');
const cartConsolidator = require('../lib/cartConsolidator');
const User = require('../models/UserModel');

module.exports.register = async (data) => {
    try {
        // check for required inputs 
        const { email, password } = data;
        checkAuthInputs(email, password);
        
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

        // handle if user had shopping cart before registering in 
        await cartConsolidator(data.cart_id, newUser.id);

        // wipe password info before returning
        wipePassword(newUser)

        // attach JWT
        return attachJWT(newUser);

    } catch(err) {
        throw err;
    };
};

module.exports.login = async (data) => {
    try {
        // check for required inputs 
        const { email, password } = data;
        checkAuthInputs(email, password);
        
        // check if user already exists
        const user = await User.findByEmail(data.email);

        // reject if email not assocaited with existing user  
        if (!user) {
            throw httpError(401, 'Incorrect email or password.');
        };

        // validate password
        const isValid = validPassword(data.password, user.pw_hash, user.pw_salt);

        // reject if password not valid
        if (!isValid) {
            throw httpError(401, 'Incorrect email or password.');
        }

        // handle if user had shopping cart before logging in 
        await cartConsolidator(data.cart_id, user.id);

        // wipe password info before returning
        wipePassword(user);

        // attach JWT and return user
        return attachJWT(user);

    } catch(err) {
        throw err;
    };
};
