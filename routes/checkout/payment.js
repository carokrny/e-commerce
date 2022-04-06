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
    *             payments:
    *               type: array
    *               items: 
    *                 $ref: '#/definitions/Payment'
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
    *     description: |
    *       User provides billing and payment info.
    *       Send either (a) payment_id and address_id of existing payment method and billing address, respectively
    *       Or (b) post new payment and address objects instead
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: address_id
    *         description: id of existing address for billing
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: address1
    *         description: first line of new address for billing
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/address1'
    *       - name: address2
    *         description: second line of new address for billing
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/address2'
    *       - name: city
    *         description: city of new address for billing
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/city'
    *       - name: state
    *         description: state of user's address for billing
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/state'
    *       - name: zip
    *         description: zip code of new address for billing
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/zip'
    *       - name: country
    *         description: country of new address for billing
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/country'
    *       - name: first_name
    *         description: first name of new address for billing
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/first_name'
    *       - name: last_name
    *         description: last name of new address for billing
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/last_name'
    *       - name: payment_id
    *         description: id of existing payment
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: provider
    *         description: provider (e.g., Visa) for new payemnt
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/provider'
    *       - name: card_type
    *         description: type (e.g., credit, debit) for new payemnt
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/card_type'
    *       - name: card_no
    *         description: card number for new payemnt
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
    *           $ref: '#/components/schemas/exp_month'
    *       - name: cvv
    *         description: cvv for new payemnt
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/cvv'
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