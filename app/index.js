const express = require('express');
const app = express();
const expressLoader = require('./express');
const routeLoader = require('../routes');
const passportLoader = require('./passport');

// load express app 
async function loadApp() {
    
    // load basic express middleware
    expressLoader(app);
    
    /**
     * Taking passport out in favor of custom jwt middlware
     */
    // // configure passport 
    // const passport = await passportLoader(app);

    // // configure routes with passport
    // routeLoader(app, passport);

    // load routes without passport
    routeLoader(app);

    // lastly, add custom error-handling middleware
    app.use((err, req, res, next) => {
        const status = err.status || 500;
        res.status(status).json(err.message);
    });
}

loadApp();

module.exports = app;