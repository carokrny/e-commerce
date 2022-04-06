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
    * definitions:
    *   User:
    *     type: object
    *     properties:
    *       id:
    *         $ref: '#/components/schemas/id'
    *       email:
    *         $ref: '#/components/schemas/email'
    *       first_name:
    *         $ref: '#/components/schemas/first_name'
    *       last_name:
    *         $ref: '#/components/schemas/last_name'
    *       primary_address_id:
    *         $ref: '#/components/schemas/nullable_id'
    *       primary_payment_id:
    *         $ref: '#/components/schemas/nullable_id'
    *       created:
    *         $ref: '#/components/schemas/date_time'
    *       modified:
    *         $ref: '#/components/schemas/date_time'
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
    *           $ref: '#/responses/UnauthorizedError'
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
    *         schema: 
    *           $ref: '#/components/schemas/email'
    *       - name: first_name
    *         description: user's first name
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/first_name'
    *       - name: last_name
    *         description: user's last name
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/last_name'
    *       - name: password
    *         description: user's password
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/password'
    *     responses:
    *       200:
    *         description: A User object
    *         schema:
    *           $ref: '#/definitions/User'
    *       401: 
    *         description: User not authorized to access route.
    *         schema:
    *           $ref: '#/responses/UnauthorizedError'
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