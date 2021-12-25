const router = require('express').Router();
const cartItemsRouter = require('./cartItems');
const { postCart, getCart } = require('../../services/cartService');
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

    // extend route to cart_items
    cartItemsRouter(router);
}