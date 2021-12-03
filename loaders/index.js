const expressLoader = require('./express');
const routeLoader = require('../routes');
const passportLoader = require('./passport');

module.exports = async (app) => {
    
    // load basic express middleware
    expressLoader(app);
    
    // configure passport 
    const passport = await passportLoader(app);

    // configure routes with passport
    routeLoader(app, passport);

    // lastly, add custom error-handling middleware
    app.use((err, req, res, next) => {
        const status = err.status || 500;
        res.status(status).send(err.message);
    });
}