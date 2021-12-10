const router = require('express').Router();
const registerService = require('../../services/registerService');

module.exports = (app) => {
    
    app.use('/register', router);

    // GET new user registration 
    router.get('/', (req, res, next) => {
        res.status(200).json('Registration form goes here');
    });

    // POST new user registration 
    router.post('/', async (req, res, next) => {
        try {
            const response = await registerService(req.body);
            res.status(201).json(response);
        } catch(err) {
            next(err);
        }
    });
};