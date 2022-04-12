const validator = require('validator');
/**
 * Custom sanitizer middleware, to sanitize and escape inputs
 * 
 * Helps protect against XSS attacks
 * */

// helper function to sanitize each value
const sanitizeValue = (value) => {
    if(value !== null && typeof value === 'string') {
        // trim excess spaces
        value = validator.trim(value);

        // strip low ASCII char, which are not usually visible
        value = validator.stripLow(value);

        // replaces <, >, &, ', " and / with their corresponding HTML entities
        value = validator.escape(value);
    }
    return value;
}


module.exports.sanitizer = (req, res, next) => {
    if (req.body) {

        // sanitize each user input in req.body
        for (const property in req.body) {
            req.body[property] = sanitizeValue(req.body[property]);
        }
    }

    next();
}