const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const pathToKey = path.join(__dirname, '../..', 'pub_key.pem');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const PUB_KEY = isProduction ? process.env.PUB_KEY : fs.readFileSync(pathToKey, 'utf8');

/**
 * CUSTOM JWT AUTH FUNCTIONS 
 * 
 * Functions handle authentication the same way, verifying encryption from ./attachJWT 
 *
 * Functions handle failed authentication differently based on needs 
 * 
 */

//--------------------------------------------------------------------------------------------------------

/**
 * Custom JWT authentication middleware, to replace passport altogether
 * 
 * checks if user is authenticated, otherwise returns a 401 error 
 * */
module.exports.isAuth = async (req, res, next) => {
    // split header which comes in format "Bearer eyJhbGciOiJ...."
    const headerParts = req.headers.authorization ? req.headers.authorization.split(' ') : [null];

    // check if header is in correct format
    if (headerParts[0] === 'Bearer' && headerParts[1].match(/\S+\.\S+\.\S+/) !== null){
        try {
            // verify JWT 
            const verified = jwt.verify(headerParts[1], PUB_KEY, { algorithms: ['RS256'] });
            // attach verified JWT to request
            req.jwt = verified;
            next();
        } catch(err) {
            next(err);
        }
    } else {
        // by default, send unauthorized. 
        res.status(401).json({ success: false, msg: 'Not authorized.' });
    }
}



/**
 * Custom JWT authentication middleware, to replace passport altogether
 * 
 * checks if user is authenticated and attaches user to request object 
 * otherwise, still allows access, just user not identified
 * */
module.exports.demiAuth = async (req, res, next) => {
    // split header which comes in format "Bearer eyJhbGciOiJ...."
    const headerParts = req.headers.authorization ? req.headers.authorization.split(' ') : [null];

    // check if header is in correct format
    if (headerParts[0] === 'Bearer' && headerParts[1].match(/\S+\.\S+\.\S+/) !== null){
        try {
            // verify JWT 
            const verified = jwt.verify(headerParts[1], PUB_KEY, { algorithms: ['RS256'] });
            // attach verified JWT to request
            req.jwt = verified;
            next();
        } catch(err) {
            next(err);
        }
    } else {
        // by default, user not identified, but still allowed access. 
        req.jwt = null;
        next();
    }
}


/**
 * Custom JWT authentication middleware for checkout routes
 * 
 * checks if user is authenticated and attaches user to request object 
 * otherwise, returns user to beginning of checkout route, which will lead to login/register route
 * */
module.exports.checkoutAuth = async (req, res, next) => {
    // split header which comes in format "Bearer eyJhbGciOiJ...."
    const headerParts = req.headers.authorization ? req.headers.authorization.split(' ') : [null];

    // check if header is in correct format
    if (headerParts[0] === 'Bearer' && headerParts[1].match(/\S+\.\S+\.\S+/) !== null){
        try {
            // verify JWT 
            const verified = jwt.verify(headerParts[1], PUB_KEY, { algorithms: ['RS256'] });
            // attach verified JWT to request
            req.jwt = verified;
            next();
        } catch(err) {
            next(err);
        }
    } else {
        // by default, redirect to cart 
        res.redirect('/cart');
    }
}