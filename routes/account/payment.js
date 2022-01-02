const router = require('express').Router({ mergeParams : true });
const { postPayment, 
        getPayment,
        putPayment,
        deletePayment,
        getAllPayments } = require('../../services/paymentService');

module.exports = async (app) => {

    app.use('/payment', router);

    /**
    * @swagger
    * definition:
    *   Card:
    *     type: object
    *     properties:
    *       id:
    *         type: integer
    *       user_id:
    *         type: integer
    *       provider:
    *         type: string
    *       card_type:
    *         type: string
    *       card_no:
    *         type: string
    *       expiry:
    *         type: string
    *       cvv:
    *         type: string
    *       billing_address_id:
    *         type: integer
    *       created:
    *         type: string
    *       modified:
    *         type: string
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
    *         type: string
    *       - name: card_type
    *         description: type of card (e.g., credit, debit)
    *         in: body
    *         required: true
    *         type: string
    *       - name: card_no
    *         description: card number
    *         in: body
    *         required: true
    *         type: string
    *       - name: expiry
    *         description: card expiration
    *         in: body
    *         required: true
    *         type: string
    *       - name: cvv
    *         description: card cvv
    *         in: body
    *         required: true
    *         type: string
    *       - name: billing_address_id
    *         description: id of address associated with billing info
    *         in: body
    *         required: true
    *         type: integer
    *     responses:
    *       201:
    *         description: A Card object.
    *         schema:
    *           $ref: '#/definitions/Card'
    *       400: 
    *         description: Invalid inputs.
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
    */
    router.post('/', async (req, res, next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // await response 
            const response = await postPayment({ ...req.body, user_id: user_id });

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
    *           $ref: '#/definitions/Card'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
    */
    router.get('/all', async (req, res ,next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // await response 
            const response = await getAllPayments(user_id);

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /account/payment/{payment_id}:
    *   get:
    *     tags:
    *       - Account
    *     description: Returns card with specified payment_id
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: payment_id
    *         description: ID associated with user's payment method
    *         in: path
    *         required: true
    *         type: integer
    *     responses:
    *       200:
    *         description: A Card object.
    *         schema:
    *           $ref: '#/definitions/Card'
    *       400: 
    *         description: Missing payment_id.
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
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
    *         type: string
    *       - name: card_type
    *         description: type of card (e.g., credit, debit)
    *         in: body
    *         required: false
    *         type: string
    *       - name: card_no
    *         description: card number
    *         in: body
    *         required: false
    *         type: string
    *       - name: expiry
    *         description: card expiration
    *         in: body
    *         required: false
    *         type: string
    *       - name: cvv
    *         description: card cvv
    *         in: body
    *         required: false
    *         type: string
    *       - name: billing_address_id
    *         description: id of address associated with billing info
    *         in: body
    *         required: false
    *         type: integer
    *     responses:
    *       200:
    *         description: A Card object.
    *         schema:
    *           $ref: '#/definitions/Card'
    *       400: 
    *         description: Missing payment_id.
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
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
    *     parameters:
    *       - name: payment_id
    *         description: ID associated with user's payment method
    *         in: path
    *         required: true
    *         type: integer
    *     responses:
    *       200:
    *         description: A Card object.
    *         schema:
    *           $ref: '#/definitions/Card'
    *       400: 
    *         description: Missing payment_id.
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
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

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

}