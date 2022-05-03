const router = require('express').Router();
const { postPayment } = require('../../services/checkoutService');
const { getAllPayments } = require('../../services/paymentService');
const { getAllAddresses } = require('../../services/addressService');
const { checkoutAuth } = require('../../lib/customAuth/jwtAuth');

module.exports = (app) => {

    app.use('/payment', router);

    /**
    * @swagger
    * /checkout/payment:
    *   get:
    *     tags:
    *       - Checkout
    *     summary: info for user to select payment method
    *     security: 
    *       - bearerJWT: []
    *       - cookieJWT: []
    *     responses:
    *       200:
    *         description: Info about user's saved payment methods
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 payments:
    *                   type: array
    *                   items:
    *                     $ref: '#/components/schemas/Card'
    *                 addresses:
    *                   type: array
    *                   items:
    *                     $ref: '#/components/schemas/Address'
    *       302:
    *         description: |
    *           Redirects to /cart if user is not authorized
    */ 
    router.get('/', checkoutAuth, async (req, res, next) => {
        try {
            // grab user_id
            const user_id = req.jwt.sub;

            // get payments
            const response = await getAllPayments(user_id);

            response.addresses = await getAllAddresses(user_id);

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
    *     summary: User selects payment from saved info or adds new one with billing address.
    *     produces:
    *       - application/json
    *     security: 
    *       - bearerJWT: []
    *       - cookieJWT: []
    *     requestBody:
    *       description: body with necessary parameters
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             oneOf:
    *               - type: object
    *                 properties:
    *                   payment_id: 
    *                     $ref: '#/components/schemas/id'
    *               - type: object
    *                 properties:
    *                   address_id: 
    *                     $ref: '#/components/schemas/id'
    *                   provider:
    *                     $ref: '#/components/schemas/provider'
    *                   card_type:
    *                     $ref: '#/components/schemas/card_type'
    *                   card_no:
    *                     $ref: '#/components/schemas/card_no'
    *                   exp_month:
    *                     $ref: '#/components/schemas/exp_month'
    *                   exp_year:
    *                     $ref: '#/components/schemas/exp_year'
    *                   cvv:
    *                     $ref: '#/components/schemas/cvv'
    *                   is_primary_payment:
    *                     $ref: '#/components/schemas/is_primary_payment'
    *               - type: object
    *                 properties:
    *                   address1:
    *                     $ref: '#/components/schemas/address1'
    *                   address2:
    *                     $ref: '#/components/schemas/address2'
    *                   city:
    *                     $ref: '#/components/schemas/city'
    *                   state:
    *                     $ref: '#/components/schemas/state'
    *                   zip:
    *                     $ref: '#/components/schemas/zip'
    *                   country:
    *                     $ref: '#/components/schemas/country'
    *                   first_name:
    *                     $ref: '#/components/schemas/first_name'
    *                   last_name:
    *                     $ref: '#/components/schemas/last_name'
    *                   is_primary_address:
    *                     $ref: '#/components/schemas/is_primary_address'
    *                   provider:
    *                     $ref: '#/components/schemas/provider'
    *                   card_type:
    *                     $ref: '#/components/schemas/card_type'
    *                   card_no:
    *                     $ref: '#/components/schemas/card_no'
    *                   exp_month:
    *                     $ref: '#/components/schemas/exp_month'
    *                   exp_year:
    *                     $ref: '#/components/schemas/exp_year'
    *                   cvv:
    *                     $ref: '#/components/schemas/cvv'
    *                   is_primary_payment:
    *                     $ref: '#/components/schemas/is_primary_payment'
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