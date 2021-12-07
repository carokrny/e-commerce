const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const pathToKey = path.join(__dirname, '..', 'pub_key.pem');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const PUB_KEY = isProduction ? process.env.PUB_KEY : fs.readFileSync(pathToKey, 'utf8');

/**
 * Custom JWT authentication middleware, to replace passport altogether
 * 
 * NOT CURRENTLY BEING USED, just for exercise
 * */
module.exports = async (req, res, next) => {
    // split header which comes in format "Bearer eyJhbGciOiJ...."
    const headerParts = req.headers.authorization.split(' ');

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