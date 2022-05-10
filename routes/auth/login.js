const router = require('express').Router();
const { login } = require('../../services/authService');
const { JWTcookieOptions } = require('../../lib/customAuth/attachJWT');
require('dotenv').config();

module.exports = (app) => {

    app.use('/login', router);

    /**
    * @swagger
    * /login:
    *   get:
    *     tags:
    *       - Auth
    *     summary: Returns login page
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description: returns csrfToken
    */
    router.get('/', (req, res, next) => {
        res.status(200).json({csrfToken: req.csrfToken()});
    });

    /**
    * @swagger
    * /login:
    *   post:
    *     tags:
    *       - Auth
    *     summary: Returns user account info and bearer token 
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
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *     responses:
    *       200:
    *         description: Object with a User object and a Bearer token object.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 user:
    *                   $ref: '#/components/schemas/User'
    *                 token:
    *                   type: string
    *                 expires:
    *                   type: number
    *                 cart:
    *                   $ref: '#/components/schemas/Cart'
    *                 cartItems:
    *                   type: array
    *                   items: 
    *                     $ref: '#/components/schemas/CartItem'
    *         headers: 
    *           Set-Cookie:
    *             schema: 
    *               type: string
    *               example: access_token=eyJhbGc...; Path=/; HttpOnly; Secure
    *       400: 
    *         description: Email or password missing.
    *       401: 
    *         description: Incorrect email or password.
    */
    router.post('/', async (req, res, next) => {
        try {
            // grab cart_id from express session, if it exists
            const cart_id = req.session.cart_id ? req.session.cart_id : null;

            // await response 
            const response = await login({ ...req.body, cart_id: cart_id });

            // attach cart_id to session, in case cart_id changed in cart consolidation
            if (response.cart) {
                req.session.cart_id = response.cart.id;
            }
            
            // put jwt in a secure cookie and send to client
            res.cookie("access_token", response.token, JWTcookieOptions).status(200).json(response);
        } catch(err) {
            next(err);
        }
    });
};