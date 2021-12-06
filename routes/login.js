const router = require('express').Router();
const loginService = require('../services/loginService');

module.exports = (app, passport) => {

    app.use('/login', router);

    // GET new user login  
    router.get('/', (req, res, next) => {
        res.send('Login form goes here.');
    });

    // POST new user login 
    router.post('/', async (req, res, next) => {
        try {
            const userAndToken = await loginService(req.body);
            res.status(200).json(userAndToken);
        } catch(err) {
            next(err);
        }
    });

};