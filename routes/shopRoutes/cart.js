const router = require('express').Router();
const cartItemsRouter = require('./cartItems');
const { postCart, getCart, getCheckout } = require('../../services/cartService');
const { demiAuth } = require('../../lib/jwtAuth');

module.exports = (app) => {

    app.use('/cart', router);

    // demi auth will still allow a user access if they are not logged in
    router.use(demiAuth);

    // POST create new cart for authenticated user
    router.post('/', async (req, res ,next) => {
        try {
            // grab user_id from json web token 
            const user_id = req.jwt ? req.jwt.sub : null;

            // await response
            const response = await postCart(user_id);

            // attach cart_id to session 
            req.session.cart_id = response.cart.id;

            // send response to client
            res.status(201).json(response);
        } catch(err) {
            next(err);
        }
    });

    // GET cart by cart id
    router.get('/', async (req, res ,next) => {
        try {
            // grab cart_id from express session, if it exists
            const cart_id = req.session.cart_id ? req.session.cart_id : null;

            // await response
            const response = await getCart(cart_id);

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // POST checkout
    router.post('/checkout', async (req, res ,next) => {
        try {
            // NOTE: checkout process only updates database, it does not process payment since this is not a real site
            // Payment info would go in req.body and be processed by a 3rd party API (e.g., Paypal, etc)

            // grab user_id from json web token 
            const user_id = req.jwt ? req.jwt.sub : null;

            // grab cart_id from express session
            const cart_id = req.session.cart_id ? req.session.cart_id : null;

            // await response
            const response = await getCheckout(user_id, cart_id);

            // send response to client
            res.status(201).json(response);
        } catch(err) {
            next(err);
        }
    });

    // extend route to cart_items
    cartItemsRouter(router);
}