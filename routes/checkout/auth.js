const router = require('express').Router();
const { login, register } = require('../../services/authService');
const { demiAuth } = require('../../lib/customAuth/jwtAuth');

module.exports = (app) => {

    app.use('/auth', router);

    /**
    * @swagger
    * /checkout/auth:
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
    router.get('/', demiAuth, (req, res, next) => {
        res.status(200).json('Login and/or Register Checkout forms go here.');
    });

    /**
    * @swagger
    * /checkout/auth/login:
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
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: email
    *         description: user's email
    *         in: body
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/email'
    *       - name: password
    *         description: user's password
    *         in: body
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/password'
    *     responses:
    *       302:
    *         description: Redirects to shipping when user is logged in. Redirects to auth if login fails.
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
                res.redirect('/checkout/auth');
            }
            next(err);
        }
    });

    /**
    * @swagger
    * /checkout/auth/register:
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
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: email
    *         description: user's email
    *         in: body
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/email'
    *       - name: password
    *         description: user's password
    *         in: body
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/password'
    *     responses:
    *       302:
    *         description: Redirects to shipping when user is logged in. Redirects to auth if registration fails.
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
                res.redirect('/checkout/auth');
            }
            next(err);
        }
    });

   
}