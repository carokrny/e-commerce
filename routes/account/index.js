const router = require('express').Router();
const ordersRouter = require('./orders');
const addressRouter = require('./address');
const paymentsRouter = require('./payment');
const { getAccount, putAccount } = require('../../services/accountService');
const { isAuth }  = require('../../lib/customAuth/jwtAuth');

module.exports = (app) => {

    app.use('/account', router);

    // authenticate user to access route
    router.use(isAuth);

    /**
    * @swagger
    * components:
    *   schemas:
    *     email:
    *       type: string
    *       format: email
    *       example: 'user@example.com'
    *     password: 
    *       type: string
    *       format: password
    *       minLength: 8
    *       pattern: ^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$
    *       example: 'str0ngPassw!rd'
    *     nullable_id:
    *       type: integer
    *       nullable: true
    *       minimum: 1
    *       example: 125
    *     User:
    *       type: object
    *       properties:
    *         id:
    *           $ref: '#/components/schemas/id'
    *         email:
    *           $ref: '#/components/schemas/email'
    *         first_name:
    *           $ref: '#/components/schemas/first_name'
    *         last_name:
    *           $ref: '#/components/schemas/last_name'
    *         primary_address_id:
    *           $ref: '#/components/schemas/nullable_id'
    *         primary_payment_id:
    *           $ref: '#/components/schemas/nullable_id'
    *         created:
    *           $ref: '#/components/schemas/date_time'
    *         modified:
    *           $ref: '#/components/schemas/date_time'
    *
    */


    /**
    * @swagger
    * /account:
    *   get:
    *     tags:
    *       - Account
    *     summary: Returns user account info
    *     security: 
    *       - bearerJWT: []
    *       - cookieJWT: []
    *     responses:
    *       200:
    *         description: A User object
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 user:
    *                   $ref: '#/components/schemas/User'
    *       401: 
    *         $ref: '#/components/responses/UnauthorizedError'
    *       404: 
    *         description: A User with the id was not found.
    */
    router.get('/', async (req, res ,next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // await response
            const response = await getAccount(user_id);
            
            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /account:
    *  put:
    *     tags:
    *       - Account
    *     summary: Returns user account info
    *     security: 
    *       - bearerJWT: []
    *       - cookieJWT: []
    *     requestBody:
    *       description: body with necessary parameters
    *       required: false
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               email:
    *                 $ref: '#/components/schemas/email'
    *               password:
    *                 $ref: '#/components/schemas/password'
    *               first_name:
    *                 $ref: '#/components/schemas/first_name'
    *               last_name:
    *                 $ref: '#/components/schemas/last_name'
    *     responses:
    *       200:
    *         description: A User object
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 user:
    *                   $ref: '#/components/schemas/User'
    *       401: 
    *         $ref: '#/components/responses/UnauthorizedError'
    *       404: 
    *         description: A User with the ID was not found.
    */
    router.put('/', async (req, res ,next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // await response 
            const response = await putAccount({ ...req.body, user_id: user_id });

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // extend route to user's orders
    ordersRouter(router);

    //extend route to user's addresses
    addressRouter(router);

    // extend route to user's payment methods 
    paymentsRouter(router);
}