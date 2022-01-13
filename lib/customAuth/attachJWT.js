const jwt = require('jsonwebtoken');
require('dotenv').config();
const PRIV_KEY = Buffer.from(process.env.PRIV_KEY, 'base64').toString('utf8');

/**
 * Returns JSON Web Token associated with user
 * 
 * @param {Object} user id of user will become `sub` in JWT
 * @return {Object} JWT wih token and expires properties
 */
 module.exports = (user) => {

    // check for valid inputs
    const { id } = user;
    if (!id) {
        return null;
    }

    // define JWT payload
    const payload = {
        sub: id, 
        iat: Date.now()
    };

    // define JWT to expire after one day 
    const expiresIn = '1d';

    // create a signed JWT 
    const signedToken = jwt.sign(payload, PRIV_KEY, {
        expiresIn: expiresIn, 
        algorithm: 'RS256'
    });

    // return object with user, token, and time token expires at 
    return {
        user: user,
        token: "Bearer " + signedToken, 
        expires: expiresIn
    };
 };