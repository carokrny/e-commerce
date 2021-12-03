const router = require('express').Router();
const form = require('../templates/register');
const registerService = require('../services/registerService');

module.exports = (app) => {
    
    app.use('/register', router);

    // GET new user registration 
    router.get('/', (req, res, next) => {
        res.send(form);
    });

    // POST new user registration 
    router.post('/', async (req, res, next) => {
        try {
            const newUser = await registerService(req.body);

            if (newUser) {
                res.status(201).redirect('./login');
            } else {
                res.status(400).send();
            }
        } catch(err) {
            next(err);
        }
    });
};