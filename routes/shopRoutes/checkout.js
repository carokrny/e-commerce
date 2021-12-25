const router = require('express').Router();
const cartItemsRouter = require('./cartItems');
const { login, register } = require('../../services/authService');
const { getOneOrder } = require('../../services/orderService');
const { getCart } = require('../../services/cartService');
const { postShipping, postCheckout } = require('../../services/checkoutService');
const { demiAuth, checkoutAuth } = require('../../lib/jwtAuth');

module.exports = (app) => {

    app.use('/checkout', router);

    // GET checkout
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
                res.redirect('/checkout/login-register');
            }
        } catch(err) {
            next(err);
        }
    });

    // GET login or guest for checkout 
    router.get('/login-register', demiAuth, (req, res, next) => {
        res.status(200).json('Login or Register Checkout forms go here.');
    });

    // POST login for checkout 
    router.post('/login', demiAuth, async (req, res, next) => {
        try {
            // redirect to shipping if user is logged in
            if (req.jwt && req.jwt.sub) res.redirect('/checkout/shipping');
            
            // grab cart_id from express session, if it exists
            const cart_id = req.session.cart_id || null;

            // await response 
            const response = await login({ ...req.body, cart_id: cart_id });

            // attach JWT 
            res.header('Authorization', response.token);

            // redirect to get shipping info 
            res.redirect('/checkout/shipping');
        } catch(err) {
            if (err.status === 400 || err.status === 401) {
                res.redirect('/checkout/login-register');
            }
            next(err);
        }
    });

    // POST register for checkout 
    router.post('/register', demiAuth, async (req, res, next) => {
        try {
            // redirect to shipping if user is logged in
            if (req.jwt && req.jwt.sub) res.redirect('/checkout/shipping');

            // grab cart_id from express session, if it exists
            const cart_id = req.session.cart_id || null;

            // await response
            const response = await register({ ...req.body, cart_id: cart_id });

            // attach JWT 
            res.header('Authorization', response.token);

            // redirect to get shipping info 
            res.redirect('/checkout/shipping');
        } catch(err) {
            if (err.status === 400 || err.status === 409) {
                res.redirect('/checkout/login-register');
            }
            next(err);
        }
    });

    // GET shipping info for checkout 
    router.get('/shipping', checkoutAuth, (req, res, next) => {
        res.status(200).json(`Form to fill out shipping info goes here. 
                            If primary_address_id !== null, automatically select it.`);
    });

    // POST shipping info for checkout 
    router.post('/shipping', checkoutAuth, async (req, res, next) => {
        try {
            // grab user_id from request
            const user_id = req.jwt.sub;

            // await response 
            const response = await postShipping({ ...req.body, user_id: user_id });

            // attach address to session
            req.session.shipping = response.shipping;

            // redirect to get payment info 
            res.redirect('/checkout/payment');
        } catch(err) {
            if (err.status === 400) {
                res.redirect('/checkout/shipping');
            }
            next(err);
        }
    });

    // GET payment method info for checkout 
    router.get('/payment', checkoutAuth, (req, res, next) => {
        res.status(200).json(`Form to fill out payment info goes here. 
                            If primary__id !== null, automatically select it.`);
    });

    // POST payment method info for checkout 
    router.post('/payment', checkoutAuth, async (req, res, next) => {
        try {
            // check that session has required cart and shipping info
            if (req.session && req.session.cart_id && req.session.shipping) {
                // grab data needed for checkout
                const data = {
                    ...req.body,
                    user_id: req.jwt.sub,
                    cart_id: req.session.cart_id,
                    shipping: req.session.shipping,
                };

                // await response 
                const response = await postCheckout(data);

                req.session.order_id = response.order.id;

                // redirect to get order summary  
                res.redirect(`/checkout/order-summary`);
            } else {
                // redirect if required session info is missing
                res.redirect('/cart/checkout');
            }

        } catch(err) {
            if (err.status === 400) {
                res.redirect('/checkout/payment');
            }
            next(err);
        }
    });

    // GET order summary 
    router.get('/order-summary', checkoutAuth, async (req, res, next) => {
        try {
            const data = { 
                user_id: req.jwt.sub, 
                order_id: req.session.order_id || null
            };

            // query database to confirm order went through 
            const response = await getOneOrder(data);

            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

}