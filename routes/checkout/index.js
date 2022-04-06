const router = require('express').Router();
const authRouter = require('./auth');
const shippingRouter = require('./shipping');
const paymentRouter = require('./payment');
const orderRouter = require('./order');
const { getCart } = require('../../services/cartService');
const { demiAuth } = require('../../lib/customAuth/jwtAuth');

module.exports = (app) => {

    app.use('/checkout', router);

    /**
    * @swagger
    * /checkout:
    *   get:
    *     tags:
    *       - Checkout
    *     description: Begins checkout flow
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *     responses:
    *       302:
    *         description: |
    *           Redirects to /checkout/auth if user not authenticated. 
    *           Redirects to /checkout/shipping if user is authenticated.
    *       400: 
    *         description: Missing cart_id.
    *         schema: 
    *           $ref: '#/responses/InputsError'
    *       404: 
    *         description: Cart associated with cart_id doesn't exist or is empty.
    */ 
    router.get('/', demiAuth, async (req, res ,next) => {
        try {
            // grab cart_id from express session, if it exists
            const cart_id = req.session.cart_id || null;

            // getCart to check if cart is empty 
            const cart = await getCart(cart_id);

            // grab user_id from json web token 
            const user_id = req.jwt ? req.jwt.sub : null;

            if (user_id) {
                // if user is signed in, skip sign in, redirect to shipping
                res.redirect('/checkout/shipping');
            } else {
                // redirect to sign in
                res.redirect('/checkout/auth');
            }
        } catch(err) {
            next(err);
        }
    });

    // extend route to auth (login & register)
    authRouter(router);

    // extend route to shipping processing
    shippingRouter(router);

    // extend route to payment & billing processing 
    paymentRouter(router);

    // extend route to order processing & confirmation
    orderRouter(router);
}