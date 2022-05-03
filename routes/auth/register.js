const router = require('express').Router();
const { register } = require('../../services/authService');
const { JWTcookieOptions } = require('../../lib/customAuth/attachJWT');
require('dotenv').config();

module.exports = (app) => {
    
    app.use('/register', router);

    /**
    * @swagger
    * /register:
    *   get:
    *     tags:
    *       - Auth
    *     summary: Returns registration page
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
    * /register:
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
    *         headers: 
    *           Set-Cookie:
    *             schema: 
    *               type: string
    *               example: access_token=eyJhbGc...; Path=/; HttpOnly; Secure
    *       400: 
    *         $ref: '#/components/responses/InputsError'
    *       409: 
    *         description: Email already in use.
    */
    router.post('/', async (req, res, next) => {
        try {
            // grab cart_id from express session, if it exists
            const cart_id = req.session.cart_id ? req.session.cart_id : null;

            // await response
            const response = await register({ ...req.body, cart_id: cart_id });

            // put jwt in a secure cookie and send to client
            res.cookie("access_token", response.token, JWTcookieOptions).status(201).json(response);
        } catch(err) {
            next(err);
        }
    });
};