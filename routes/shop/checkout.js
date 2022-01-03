const router = require('express').Router();
const cartItemsRouter = require('./cartItems');
const { login, register } = require('../../services/authService');
const { getOneOrder } = require('../../services/orderService');
const { getCart } = require('../../services/cartService');
const { postShipping, postCheckout } = require('../../services/checkoutService');
const { demiAuth, checkoutAuth } = require('../../lib/customAuth/jwtAuth');

module.exports = (app) => {

    app.use('/checkout', router);

    // DO SWAGGER FIRST 
    // PULL CHECKOUT INTO ITS OWN DIRECTORY? 
    // SPLIT ROUTES WITH ROUTERS
    // ADD ANOTHER ROUTE FOR REVIEW AND SUBMIT

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
    *         type: integer
    *     responses:
    *       302:
    *         description: Redirects user to login/register if not logged in. Redirects to shipping if logged in.
    *       400: 
    *         description: Missing cart_id.
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
                res.redirect('/checkout/login-register');
            }
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /checkout/login-register:
    *   get:
    *     tags:
    *       - Checkout
    *     description: Returns login/registration forms
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description: Login and/or registration forms.
    */ 
    router.get('/login-register', demiAuth, (req, res, next) => {
        res.status(200).json('Login or Register Checkout forms go here.');
    });

    /**
    * @swagger
    * /checkout/login:
    *   post:
    *     tags:
    *       - Checkout
    *     description: Logs user into account and attached authentication
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         type: integer
    *       - name: email
    *         description: user's email
    *         in: body
    *         required: true
    *         type: string
    *       - name: password
    *         description: user's password
    *         in: body
    *         required: true
    *         type: string
    *     responses:
    *       302:
    *         description: Redirects to shipping when user is logged in. Redirects to login-register if login fails.
    */ 
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

    /**
    * @swagger
    * /checkout/register:
    *   POST:
    *     tags:
    *       - Checkout
    *     description: Registers user account and attaches authentication
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         type: integer
    *       - name: email
    *         description: user's email
    *         in: body
    *         required: true
    *         type: string
    *       - name: password
    *         description: user's password
    *         in: body
    *         required: true
    *         type: string
    *     responses:
    *       302:
    *         description: Redirects to shipping when user is logged in. Redirects to login-register if registration fails.
    */ 
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

   /**
    * @swagger
    * /checkout/shipping:
    *   get:
    *     tags:
    *       - Checkout
    *     description: Returns shipping info forms
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: Shipping info form.
    *       302:
    *         description: Redirects to /cart if user is not authorized
    */ 
    router.get('/shipping', checkoutAuth, (req, res, next) => {
        res.status(200).json(`Form to fill out shipping info goes here. 
                            If primary_address_id !== null, automatically select it.`);
    });

    /**
    * @swagger
    * /checkout/shipping:
    *   post:
    *     tags:
    *       - Checkout
    *     description: User selects existing address for shipping or creates new address
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: first_name
    *         description: user's first name
    *         in: body
    *         required: true
    *         type: string
    *       - name: last_name
    *         description: user's last name
    *         in: body
    *         required: true
    *         type: string
    *       - name: address_id
    *         description: id of existing address
    *         in: body
    *         required: false
    *         type: integer
    *       - name: address1
    *         description: first line of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: address2
    *         description: second line of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: city
    *         description: city of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: zip
    *         description: zip code of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: country
    *         description: country of user's new address
    *         in: body
    *         required: false
    *         type: string
    *     responses:
    *       302: 
    *         description: Redirects to /payment if shipping info input. Invalid inputs redirects to /shipping. Unauth user redirects to /cart.
    */
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

    /**
    * @swagger
    * /checkout/payment:
    *   get:
    *     tags:
    *       - Checkout
    *     description: Returns payment and billing address info forms
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: Payment and billing info info form.
    *       302:
    *         description: Redirects to /cart if user is not authorized
    */ 
    router.get('/payment', checkoutAuth, (req, res, next) => {
        res.status(200).json(`Form to fill out payment info goes here. 
                            If primary__id !== null, automatically select it.`);
    });

    /**
    * @swagger
    * /checkout/shipping:
    *   post:
    *     tags:
    *       - Checkout
    *     description: User selects existing address for billing or creates new address, user selects existing payment method or creates new one.
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: first_name
    *         description: user's first name
    *         in: body
    *         required: true
    *         type: string
    *       - name: last_name
    *         description: user's last name
    *         in: body
    *         required: true
    *         type: string
    *       - name: address_id
    *         description: id of existing address
    *         in: body
    *         required: false
    *         type: integer
    *       - name: address1
    *         description: first line of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: address2
    *         description: second line of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: city
    *         description: city of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: zip
    *         description: zip code of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: country
    *         description: country of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: payment_id
    *         description: id of existing payment
    *         in: body
    *         required: false
    *         type: integer
    *       - name: provider
    *         description: new card's provider (e.g., Visa)
    *         in: body
    *         required: false
    *         type: string
    *       - name: card_type
    *         description: type of new card (e.g., credit, debit)
    *         in: body
    *         required: false
    *         type: string
    *       - name: card_no
    *         description: new card number
    *         in: body
    *         required: false
    *         type: string
    *       - name: expiry
    *         description: new card expiration
    *         in: body
    *         required: false
    *         type: string
    *       - name: cvv
    *         description: new card cvv
    *         in: body
    *         required: false
    *         type: string
    *     responses:
    *       302: 
    *         description: Redirects to /order-summary if payment info input. Invalid inputs redirects to /payment. Unauth user redirects to /cart.
    */
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

    /**
    * @swagger
    * /checkout/order-summary:
    *   get:
    *     tags:
    *       - Checkout
    *     description: Returns order summary
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: order_id
    *         description: ID of order
    *         in: cookie
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: An Order object.
    *         schema:
    *           $ref: '#/definitions/Order'
    *       302:
    *         description: Redirects to /cart if user is not authorized
    *       400: 
    *         description: Missing order_id.
    *       403: 
    *         description: User not associated with specified order_id.
    *       404: 
    *         description: No order found with specified order_id.
    */ 
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