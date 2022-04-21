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
    *     description: Returns login page
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description: Login form.
    */
    router.get('/', (req, res, next) => {
        res.status(200).json('Login form goes here.');
    });

    /**
    * @swagger
    * /login:
    *   post:
    *     tags:
    *       - Auth
    *     description: Returns user account info and bearer token 
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
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
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *     responses:
    *       200:
    *         description: Object with a User object and a Bearer token object. 
    *         schema:
    *           type: object
    *           properties: 
    *             user:
    *               $ref: '#/definitions/User'
    *             token:
    *               type: string
    *             expires:
    *               type: string
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

            // put jwt in a secure cookie and send to client
            res.cookie("access_token", response.signedToken, JWTcookieOptions).status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

};