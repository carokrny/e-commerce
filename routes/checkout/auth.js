const router = require('express').Router();
const { login, register } = require('../../services/authService');
const { demiAuth } = require('../../lib/customAuth/jwtAuth');
const { JWTcookieOptions } = require('../../lib/customAuth/attachJWT');

module.exports = (app) => {

    app.use('/auth', router);

    /**
    * @swagger
    * /checkout/auth:
    *   get:
    *     tags:
    *       - Checkout
    *     summary: Returns login/registration forms
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
    *     summary: Logs user into account and attaches authentication
    *     requestBody:
    *       description: body with necessary parameters
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               email:
    *                 $ref: '#/components/schemas/email'
    *               password:
    *                 $ref: '#/components/schemas/password'
    *             required:
    *               - email
    *               - password
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *     responses:
    *       302:
    *         description: Redirects to shipping when user is logged in. Redirects to auth if login fails.
    *         headers: 
    *           Set-Cookie:
    *             schema: 
    *               type: string
    *               example: access_token=eyJhbGc...; Path=/; HttpOnly; Secure
    */ 
    router.post('/login', demiAuth, async (req, res, next) => {
        try {
            // check if user is already logged in 
            if (req.jwt && req.jwt.sub) {
                // redirect to shipping if user is logged in
                res.redirect('/checkout/shipping');
            } else {
            
                // grab necessary data 
                const data = {
                    email: req.body.email,
                    password: req.body.password,
                    cart_id: req.session.cart_id || null
                }

                // await response 
                const response = await login(data);

                // attach cart_id to session, in case cart_id changed in cart consolidation
                if (response.cart && data.cart_id !== response.cart.id) {
                    req.session.cart_id = response.cart.id;
                }

                // add JWT to header
                res.header('Authorization', response.token);

                // attach JWT cookie and redirect to get shipping info 
                res.cookie("access_token", response.token, JWTcookieOptions).redirect('/checkout/shipping');
            }
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
    *   post:
    *     tags:
    *       - Checkout
    *     summary: Registers user account and attaches authentication
    *     requestBody:
    *       description: body with necessary parameters
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               email:
    *                 $ref: '#/components/schemas/email'
    *               password:
    *                 $ref: '#/components/schemas/password'
    *             required:
    *               - email
    *               - password
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *     responses:
    *       302:
    *         description: Redirects to shipping when user is logged in. Redirects to auth if registration fails.
    *         headers: 
    *           Set-Cookie:
    *             schema: 
    *               type: string
    *               example: access_token=eyJhbGc...; Path=/; HttpOnly; Secure
    */ 
    router.post('/register', demiAuth, async (req, res, next) => {
        try {
            // check if user is already logged in 
            if (req.jwt && req.jwt.sub) {
                // redirect to shipping if user is logged in
                res.redirect('/checkout/shipping');
            } else {

                // grab necessary data 
                const data = {
                    email: req.body.email,
                    password: req.body.password,
                    cart_id: req.session.cart_id || null
                }

                // await response
                const response = await register(data/*{ ...req.body, cart_id: cart_id }*/);

                // attach cart_id to session, in case cart_id changed in cart consolidation
                if (response.cart && data.cart_id !== response.cart.id) {
                    req.session.cart_id = response.cart.id;
                }

                // add JWT to header 
                res.header('Authorization', response.token);

                // attach cookie and redirect to get shipping info 
                res.cookie("access_token", response.token, JWTcookieOptions).redirect('/checkout/shipping');
            }
        } catch(err) {
            if (err.status === 400 || err.status === 409) {
                res.redirect('/checkout/auth');
            }
            next(err);
        }
    });
}