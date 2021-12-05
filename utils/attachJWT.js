const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pathToKey = path.join(__dirname, '..', 'priv_key.pem');

const isProduction = process.env.NODE_ENV === 'production';
const PRIV_KEY = isProduction ? process.env.PRIV_KEY : fs.readFileSync(pathToKey, 'utf8');

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