const router = require('express').Router();
const ordersRouter = require('./orders');
const addressRouter = require('./address');
const paymentsRouter = require('./payment');
const { getAccount, putAccount } = require('../../services/accountService');
const { isAuth }  = require('../../lib/jwtAuth');

module.exports = (app) => {

    app.use('/account', router);

    // authenticate user to access route
    router.use(isAuth);

    /**
    * @swagger
    * definition:
    *   User:
    *     type: object
    *     properties:
    *       id:
    *         type: integer
    *       email:
    *         type: string
    *       first_name:
    *         type: string
    *       last_name:
    *         type: string
    *       created:
    *         type: string
    *       modified:
    *         type: string
    *       primary_address_id:
    *         type: integer
    *       primary_payment_id:
    *         type: integer
    *
    */


    /**
    * @swagger
    * /account:
    *   get:
    *     tags:
    *       - Account
    *     description: Returns user account info
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: A User object
    *         schema:
    *           $ref: '#/definitions/User'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
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
    *     description: Returns user account info
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: email
    *         description: user's email
    *         in: body
    *         required: false
    *         type: string
    *       - name: first_name
    *         description: user's first name
    *         in: body
    *         required: false
    *         type: string
    *       - name: last_name
    *         description: user's last name
    *         in: body
    *         required: false
    *         type: string
    *       - name: password
    *         description: user's password
    *         in: body
    *         required: false
    *         type: string
    *       - name: primary_address_id
    *         description: id of user's primary address
    *         in: body
    *         required: false
    *         type: integer
    *       - name: primary_payment_id
    *         description: id of user's primary payment method
    *         in: body
    *         required: false
    *         type: integer
    *     responses:
    *       200:
    *         description: A User object
    *         schema:
    *           $ref: '#/definitions/User'
    *       401: 
    *         description: User not authorized to access route.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
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