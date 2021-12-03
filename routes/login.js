const router = require('express').Router();
const form = require('../templates/login');

module.exports = (app, passport) => {

    app.use('/login', router);

    // GET new user login  
    router.get('/', (req, res, next) => {
        res.send(form);
    });

    // POST new user login 
    router.post('/', passport.authenticate('local', { failureRedirect: '/login/failure', successRedirect: '/login/success' }));

    // GET login success route 
    router.get('/success', (req, res, next) => {
        res.send(`<p>You have successfully logged in. --> [[add protected route]]</p>`)
    });

    // GET login failure route
    router.get('/failure', (req, res, next) => {
        res.send(`<p>Incorrect email or password. Please <a href="/login">try again</a>.` + form);
    });
};