const router = require('express').Router();
const { register } = require('../../services/authService');

module.exports = (app) => {
    
    app.use('/register', router);

    /**
    * @swagger
    * /register:
    *   get:
    *     tags:
    *       - Auth
    *     description: Returns registration page
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description: Register form.
    */
    router.get('/', (req, res, next) => {
        res.status(200).json('Registration form goes here');
    });

    /**
    * @swagger
    * /register:
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
    *         schema:
    *           $ref: '#/responses/InputsError'
    *       401: 
    *         description: Incorrect email or password.
    *         schema:
    *           $ref: '#/responses/UnauthorizedError'
    *       409: 
    *         description: Email already in use.
    */
    router.post('/', async (req, res, next) => {
        try {
            // grab cart_id from express session, if it exists
            const cart_id = req.session.cart_id ? req.session.cart_id : null;

            // await response
            const response = await register({ ...req.body, cart_id: cart_id });

            // send response to client
            res.status(201).json(response);
        } catch(err) {
            next(err);
        }
    });
};