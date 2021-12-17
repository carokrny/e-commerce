const router = require('express').Router();
const { register } = require('../../services/authService');

module.exports = (app) => {
    
    app.use('/register', router);

    // GET new user registration 
    router.get('/', (req, res, next) => {
        res.status(200).json('Registration form goes here');
    });

    // POST new user registration 
    router.post('/', async (req, res, next) => {
        try {
            // grab cart_id from express session, if it exists
            const cart_id = req.session.cart_id ? req.session.cart_id : null;

            // await response
            const response = await register({...req.body, cart_id: cart_id });

            // send response to client
            res.status(201).json(response);
        } catch(err) {
            next(err);
        }
    });
};