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
            // grab cart_id from express session, if it exists
            const cart_id = req.session.cart_id ? req.session.cart_id : null;

            // await response 
            const response = await login({ ...req.body, cart_id: cart_id });

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

};