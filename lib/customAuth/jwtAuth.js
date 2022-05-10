const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const PUB_KEY = Buffer.from(process.env.PUB_KEY, 'base64').toString('utf8');

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
 * Helper function to verify JWT based on encryption from ./attachJWT
 * 
 */
const verify = (token) => {
    return jwt.verify(token, PUB_KEY, { algorithms: ['RS256'] });
}


/**
 * Helper auth function to handle JWT extraction and verification logic
 * 
 * Can authenticate both:
 *  - JWT Bearer tokens 
 *  - JWT in a cookie called 'access token'
 * 
 * @param callback a callback function to be called if the JWT is missing
 */
const jwtAuth = async (req, res, next, callback) => {
    // split header which comes in format "Bearer eyJhbGciOiJ...."
    const headerParts = req.headers.authorization ? req.headers.authorization.split(' ') : [null];

    // grab token from cookie, if it exists
    const tokenInCookie = req.cookies.access_token || null;

    try {
        // check token in cookie 
        if (tokenInCookie) {
            // verify JWT and attach to req
            req.jwt = verify(tokenInCookie);
            next();

        // check if header is in correct format
        } else if (headerParts[0] === 'Bearer' && headerParts[1].match(/\S+\.\S+\.\S+/) !== null) {
            // verify JWT and attach to req
            req.jwt = verify(headerParts[1]);
            next();

        } else {
            // call callback
            callback();
        }
    } catch(e) {
        next(e)
    }
}


/**
 * Custom JWT authentication middleware, to replace passport altogether
 * 
 * checks if user is authenticated, otherwise returns a 401 error 
 * */
module.exports.isAuth = async (req, res, next) => {
    // callback is to throw a 401 error, not authorized
    const callback = () => {
        res.status(401).json({ success: false, msg: 'Not authorized.' });
    };

    // call Auth helper middleware
    jwtAuth(req, res, next, callback);
}



/**
 * Custom JWT authentication middleware, to replace passport altogether
 * 
 * checks if user is authenticated and attaches user to request object 
 * otherwise, still allows access, just user not identified
 * */
module.exports.demiAuth = async (req, res, next) => {
    // by default, user not identified, but still allowed access. 
    const callback = () => {
        req.jwt = null;
        next();
    }

    // call Auth helper middleware
    jwtAuth(req, res, next, callback);
}


/**
 * Custom JWT authentication middleware for checkout routes
 * 
 * checks if user is authenticated and attaches user to request object 
 * otherwise, returns user to beginning of checkout route, which will lead to login/register route
 * */
module.exports.checkoutAuth = async (req, res, next) => {
    // by default, redirect to cart 
    const callback = () => {
        res.redirect('/cart');
    }

    // call Auth helper middleware
    jwtAuth(req, res, next, callback);
}