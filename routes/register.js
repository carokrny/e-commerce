const router = require('express').Router();
const registerPage = require('../templates/registerPage');
const registerService = require('../services/registerService');

module.exports = (app) => {
    
    app.use('/register', router);

    // GET new user registration 
    router.get('/', (req, res, next) => {
        res.send(registerPage);
    });

    // POST new user registration 
    router.post('/', async (req, res, next) => {
        try {
            const userAndToken = await registerService(req.body);
            res.status(201).json(userAndToken);
        } catch(err) {
            next(err);
        }
    });
};