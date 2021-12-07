const router = require('express').Router();
const cartItemsRouter = require('./cartItems');
const { postCart, getCart, getCheckout } = require('../services/cartService');

module.exports = (app, passport) => {

    app.use('/cart', router);

    // POST create new cart for authenticated user
    router.post('/', passport.authenticate('jwt', {session: false}), async (req, res ,next) => {
        try {
            const response = await postCart(req.user.id);
            res.json(response);
        } catch(err) {
            next(err);
        }
    });

    // GET cart by cart id
    router.get('/:cart_id', passport.authenticate('jwt', {session: false}), async (req, res ,next) => {
        try {
            const response = await getCart(req.params.cart_id);
            res.json(response);
        } catch(err) {
            next(err);
        }
    });

    // POST checkout
    router.post('/:cart_id/checkout', passport.authenticate('jwt', {session: false}), async (req, res ,next) => {
        try {
            // NOTE: checkout process only updates database, it does not process payment since this is not a real site
            // Payment info would go in req.body and be processed by a 3rd party API (e.g., Paypal)

            const response = await getCheckout(req.user.id, req.params.cart_id);
            res.json(response);
        } catch(err) {
            next(err);
        }
    });

    // extend route to cart items
    cartItemsRouter(router, passport);
}