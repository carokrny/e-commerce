const csrf = require('csurf');
require('dotenv').config();

// middleware that attaches a _csrf cookie and validates the header 
module.exports.csrfProtection = csrf({
    cookie: {
        maxAge: 60 * 60 * 24, // 1 day
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    }
});


// middleware that attaches the XSRF-TOKEN cookie 
module.exports.attachCSRF = (req, res, next) => {
    if(!req.cookies[`XSRF-TOKEN`]) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
    }
    next();
}
