const router = require('express').Router({ mergeParams : true });
const { wipeCardData } = require('../../lib/formatUtils');
const { postPayment, 
    getPayment,
    putPayment,
    deletePayment,
    getAllPayments } = require('../../services/paymentService');

module.exports = async (app) => {

    app.use('/payment', router);

    /**
    * @swagger
    * components:
    *   schemas:
    *     provider:
    *       type: string
    *       example: 'Visa'
    *     card_type:
    *       type: string
    *       enum: 
    *         - 'debit'
    *         - 'credit'
    *       example: 'debit'
    *     card_no:
    *       type: string
    *       minLength: 16
    *       maxLength: 16
    *       example: '4000400040004000'
    *       pattern: ^[0-9]*$
    *     exp_month:
    *       type: integer
    *       minimum: 1
    *       maximum: 12
    *       example: 5
    *     exp_year:
    *       type: integer
    *       minimum: 2020
    *       maximum: 2100
    *       example: 2024
    *     cvv:
    *       type: string
    *       minLength: 3
    *       maxLength: 3
    *       pattern: ^[0-9]*$
    *       example: '123'
    *     is_primary_payment:
    *       type: boolean
    *       example: false
    * definitions:
    *   Card:
    *     type: object
    *     properties:
    *       id:
    *         $ref: '#/components/schemas/id'
    *       user_id:
    *         $ref: '#/components/schemas/id'
    *       provider:
    *         $ref: '#/components/schemas/provider'
    *       card_type:
    *         $ref: '#/components/schemas/card_type'
    *       card_no:
    *         $ref: '#/components/schemas/card_no'
    *       exp_month:
    *         $ref: '#/components/schemas/exp_month'
    *       exp_year:
    *         $ref: '#/components/schemas/exp_year'
    *       cvv:
    *         $ref: '#/components/schemas/cvv'
    *       billing_address_id:
    *         $ref: '#/components/schemas/id'
    *       created:
    *         $ref: '#/components/schemas/date_time'
    *       modified:
    *         $ref: '#/components/schemas/date_time'
    *       is_primary_payment:
    *         $ref: '#/components/schemas/is_primary_payment'
    *
    */

    /**
    * @swagger
    * /account/payment:
    *   post:
    *     tags:
    *       - Account
    *     description: Creates and returns new card payment method
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: provider
    *         description: card's provider (e.g., Visa)
    *         in: body
    *         required: true
    *         schema:
    *           $ref: '#/components/schemas/provider'
    *       - name: card_type
    *         description: type of card (e.g., credit, debit)
    *         in: body
    *         required: true
    *         schema:
    *           $ref: '#/components/schemas/card_type'
    *       - name: card_no
    *         description: card number
    *         in: body
    *         required: true
    *         schema:
    *           $ref: '#/components/schemas/card_no'
    *       - name: exp_month
    *         description: card expiration month
    *         in: body
    *         required: true
    *         schema:
    *           $ref: '#/components/schemas/exp_month'
    *       - name: exp_year
    *         description: card expiration year
    *         in: body
    *         required: true
    *         schema:
    *           $ref: '#/components/schemas/exp_year'
    *       - name: cvv
    *         description: card cvv
    *         in: body
    *         required: true
    *         schema:
    *           $ref: '#/components/schemas/cvv'
    *       - name: billing_address_id
    *         description: id of address associated with billing info
    *         in: body
    *         required: true
    *         schema:
    *           $ref: '#/components/schemas/id'
    *       - name: is_primary_payment
    *         description: whether this is user's primary payment method
    *         in: body
    *         required: false
    *         schema:
    *           $ref: '#/components/schemas/is_primary_payment'
    *     responses:
    *       201:
    *         description: A Card object.
    *         schema:
    *           $ref: '#/definitions/Card'
    *       400: 
    *         description: Invalid inputs.
    *         schema:
    *           $ref: '#/responses/InputsError'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/responses/UnauthorizedError'
    */
    router.post('/', async (req, res, next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // await response 
            const response = await postPayment({ ...req.body, user_id: user_id });

            // wipe sensitive data 
            wipeCardData(response.payment);

            // send response to client 
            res.status(201).json(response);
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /account/payment/all:
    *   get:
    *     tags:
    *       - Account
    *     description: Returns all card payment methods associated with user
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: An array of Card objects.
    *         schema:
    *           type: array 
    *           items: 
    *             $ref: '#/definitions/Card'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/responses/UnauthorizedError'
    */
    router.get('/all', async (req, res ,next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // await response 
            const response = await getAllPayments(user_id);

            // wipe sensitive data 
            response.payments.forEach(payment => wipeCardData(payment));

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /account/payment/{payment_id}:
    *   parameters:
    *     - in: path
    *       name: payment_id
    *       description: ID associated with user's payment method
    *       required: true
    *       type: integer
    *   get:
    *     tags:
    *       - Account
    *     description: Returns card with specified payment_id
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: A Card object.
    *         schema:
    *           $ref: '#/definitions/Card'
    *       400: 
    *         description: Missing payment_id.
    *         schema: 
    *           $ref: '#/responses/InputsError'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/responses/UnauthorizedError'
    *       403: 
    *         description: User not associated with specified payment_id.
    *       404: 
    *         description: No payment method found with specified payment_id.
    */ 
    router.get('/:payment_id', async (req, res, next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;
             
            // grab payment from express params
            const payment_id = req.params.payment_id;

            // await response 
            const response = await getPayment({payment_id, user_id });

            // wipe sensitive data 
            wipeCardData(response.payment);

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /account/payment/{payment_id}:
    *   put:
    *     tags:
    *       - Account
    *     description: Updates and returns card payment method with specified ID
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: provider
    *         description: card's provider (e.g., Visa)
    *         in: body
    *         required: false
    *         schema:
    *           $ref: '#/components/schemas/provider'
    *       - name: card_type
    *         description: type of card (e.g., credit, debit)
    *         in: body
    *         required: false
    *         schema:
    *           $ref: '#/components/schemas/card_type'
    *       - name: card_no
    *         description: card number
    *         in: body
    *         required: false
    *         schema:
    *           $ref: '#/components/schemas/card_no'
    *       - name: exp_month
    *         description: card expiration month
    *         in: body
    *         required: false
    *         schema:
    *           $ref: '#/components/schemas/exp_month'
    *       - name: exp_year
    *         description: card expiration year
    *         in: body
    *         required: false
    *         schema:
    *           $ref: '#/components/schemas/exp_year'
    *       - name: cvv
    *         description: card cvv
    *         in: body
    *         required: false
    *         schema:
    *           $ref: '#/components/schemas/cvv'
    *       - name: billing_address_id
    *         description: id of address associated with billing info
    *         in: body
    *         required: false
    *         schema:
    *           $ref: '#/components/schemas/id'
    *       - name: is_primary_payment
    *         description: whether this is user's primary payment method
    *         in: body
    *         required: false
    *         schema:
    *           $ref: '#/components/schemas/is_primary_payment'
    *     responses:
    *       200:
    *         description: A Card object.
    *         schema:
    *           $ref: '#/definitions/Card'
    *       400: 
    *         description: Missing payment_id.
    *         schema: 
    *           $ref: '#/responses/InputsError'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/responses/UnauthorizedError'
    *       403: 
    *         description: User not associated with specified payment_id.
    *       404: 
    *         description: No payment method found with specified payment_id.
    */
    router.put('/:payment_id', async (req, res, next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // grab payment from express params
            const payment_id = req.params.payment_id;

            // await response 
            const response = await putPayment({
                ...req.body, 
                payment_id: payment_id, 
                user_id: user_id
            });

            // wipe sensitive data 
            wipeCardData(response.payment);

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /account/payment/{payment_id}:
    *   delete:
    *     tags:
    *       - Account
    *     description: Returns card with specified payment_id
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: A Card object.
    *         schema:
    *           $ref: '#/definitions/Card'
    *       400: 
    *         description: Missing payment_id.
    *         schema:
    *           $ref: '#/responses/InputsError'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/responses/UnauthorizedError'
    *       403: 
    *         description: User not associated with specified payment_id.
    *       404: 
    *         description: No payment method found with specified payment_id.
    */ 
    router.delete('/:payment_id', async (req, res, next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // grab payment from express params
            const payment_id = req.params.payment_id;

            // await response 
            const response = await deletePayment({ payment_id, user_id });

            // wipe sensitive data 
            wipeCardData(response.payment);

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });
}