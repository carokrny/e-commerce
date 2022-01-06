const router = require('express').Router();
const { postPayment } = require('../../services/checkoutService');
const { getAllPayments } = require('../../services/paymentService');
const { checkoutAuth } = require('../../lib/customAuth/jwtAuth');

module.exports = (app) => {

    app.use('/payment', router);

    /**
    * @swagger
    * /checkout/payment:
    *   get:
    *     tags:
    *       - Checkout
    *     description: info for user to select payment method
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: Info about user's saved payment methods
    *         schema:
    *           type: object
    *           properties: 
    *               payments:
    *                 type: array
    *                 items: 
    *                   $ref: '#/definitions/Payment'
    *       302:
    *         description: |
    *           Redirects to /cart if user is not authorized
    */ 
    router.get('/', checkoutAuth, async (req, res, next) => {
        try {
            // grab user_id
            const user_id = req.jwt.sub;

            // get addresses
            const response = await getAllPayments(user_id);

            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /checkout/payment:
    *   post:
    *     tags:
    *       - Checkout
    *     description: User provides billing and payment info.
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: first_name
    *         description: user's first name
    *         in: body
    *         required: true
    *         type: string
    *       - name: last_name
    *         description: user's last name
    *         in: body
    *         required: true
    *         type: string
    *       - name: address_id
    *         description: id of existing address
    *         in: body
    *         required: false
    *         type: integer
    *       - name: address1
    *         description: first line of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: address2
    *         description: second line of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: city
    *         description: city of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: zip
    *         description: zip code of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: country
    *         description: country of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: payment_id
    *         description: id of existing payment
    *         in: body
    *         required: false
    *         type: integer
    *       - name: provider
    *         description: new card's provider (e.g., Visa)
    *         in: body
    *         required: false
    *         type: string
    *       - name: card_type
    *         description: type of new card (e.g., credit, debit)
    *         in: body
    *         required: false
    *         type: string
    *       - name: card_no
    *         description: new card number
    *         in: body
    *         required: false
    *         type: string
    *       - name: expiry
    *         description: new card expiration
    *         in: body
    *         required: false
    *         type: string
    *       - name: cvv
    *         description: new card cvv
    *         in: body
    *         required: false
    *         type: string
    *     responses:
    *       302: 
    *         description: |
    *           Redirects to checkout/order if payment info input. 
    *           Redirects to checkout/payment if inputs invalid. 
    *           Redirects to /cart if user not authenticated.
    */
    router.post('/', checkoutAuth, async (req, res, next) => {
        try {
            // grab data needed for checkout
            const data = {
                ...req.body,
                user_id: req.jwt.sub,
            };

            // await response 
            const response = await postPayment(data);

            // attach billing info to session
            req.session.billing_address_id = response.billing.id;

            // attach payment method to session
            req.session.payment_id = response.payment.id;

            // redirect to get order review  
            res.redirect(`/checkout/order`);
        } catch(err) {
            if (err.status === 400) {
                res.redirect('/checkout/payment');
            }
            next(err);
        }
    });
}