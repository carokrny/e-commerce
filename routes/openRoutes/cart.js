const router = require('express').Router();
const cartItemsRouter = require('./cartItems');
const { postCart, getCart, getCheckout } = require('../../services/cartService');
const { demiAuth } = require('../../utils/jwtAuth');

module.exports = (app) => {

    app.use('/cart', router);

    // demi auth will still allow a user access if they are not logged in
    router.use(demiAuth);

    // POST create new cart for authenticated user
    router.post('/', async (req, res ,next) => {
        try {
            const user_id = req.jwt ? req.jwt.sub : null;

            const response = await postCart(user_id);

            res.status(201).json(response);
        } catch(err) {
            next(err);
        }
    });

    // GET cart by cart id
    router.get('/:cart_id', async (req, res ,next) => {
        try {
            const cart_id = req.params.cart_id;

            const response = await getCart(cart_id);

            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // POST checkout
    router.post('/:cart_id/checkout', async (req, res ,next) => {
        try {
            // NOTE: checkout process only updates database, it does not process payment since this is not a real site
            // Payment info would go in req.body and be processed by a 3rd party API (e.g., Paypal)
            const user_id = req.jwt ? req.jwt.sub : null;
            const cart_id = req.params.cart_id;

            const response = await getCheckout(user_id, cart_id);

            res.status(201).json(response);
        } catch(err) {
            next(err);
        }
    });

    // extend route to cart items
    cartItemsRouter(router);
}