const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

require('dotenv').config();

module.exports = (app) => {
    
    // enable cross-origin resource sharing
    app.use(cors());

    // parse incoming json req
    app.use(bodyParser.json());

    // parse incoming url-encoded req
    app.use(bodyParser.urlencoded({extended: true}));

    // trust first proxy for session
    app.set('trust proxy', 1) 

    // enable session for use with passport 
    app.use(session ({
        secret: process.env.SESSION_SECRET, 
        resave: false, 
        saveUninitialized: true, 
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
    }));

    // NTS - add store property to session and npm i connect-pg-simple to save sessions data to database?

    // ??
    // return app;
}