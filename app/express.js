const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('../db/config');
const { sanitizer } = require('../lib/sanitizer');
const { csrfProtection } = require('../lib/csrf');
require('dotenv').config();


module.exports = (app) => {

    // helmet for added security on http headers
    app.use(helmet());

    // parse incoming json req
    app.use(bodyParser.json());

    // parse incoming url-encoded form data
    app.use(bodyParser.urlencoded({ extended: true }));

    // parse all cookies into req.cookie and req.signedCookie
    app.use(cookieParser());

    // custom middleware to sanitize user inputs
    app.use(sanitizer);

    // trust first proxy for session cookie secure
    app.set('trust proxy', 1);

    // enable session for persistent cart
    app.use(session ({
        store: new pgSession({
            pool: pool,
            tableName: 'session'
        }),
        secret: process.env.SESSION_SECRET, 
        resave: false, 
        saveUninitialized: true, 
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
        }
    }));

    // protect routes from CSRF attacks
    app.use(csrfProtection);

}