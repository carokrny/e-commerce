const router = require('express').Router();
const { login } = require('../../services/authService');

module.exports = (app) => {

    app.use('/login', router);

    // GET new user login  
    router.get('/', (req, res, next) => {
        res.status(200).json('Login form goes here.');
    });

    // POST new user login 
    router.post('/', async (req, res, next) => {
        try {
            const response = await login(req.body);
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

};