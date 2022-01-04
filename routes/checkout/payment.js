const router = require('express').Router();
const { postCheckout } = require('../../services/checkoutService');
const { checkoutAuth } = require('../../lib/customAuth/jwtAuth');

module.exports = (app) => {

    app.use('/payment', router);

    /**
    * @swagger
    * /checkout/payment:
    *   get:
    *     tags:
    *       - Checkout
    *     description: Returns payment and billing address info forms
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: Payment and billing info info form.
    *       302:
    *         description: Redirects to /cart if user is not authorized
    */ 
    router.get('/', checkoutAuth, (req, res, next) => {
        res.status(200).json(`Form to fill out payment info goes here. 
                            If primary__id !== null, automatically select it.`);
    });

    /**
    * @swagger
    * /checkout/shipping:
    *   post:
    *     tags:
    *       - Checkout
    *     description: User selects existing address for billing or creates new address, user selects existing payment method or creates new one.
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
    *         description: Redirects to /order/confirmation if payment info input. Invalid inputs redirects to /payment. Unauth user redirects to /cart.
    */
    router.post('/', checkoutAuth, async (req, res, next) => {
        try {
            // check that session has required cart and shipping info
            if (req.session && req.session.cart_id && req.session.shipping) {
                // grab data needed for checkout
                const data = {
                    ...req.body,
                    user_id: req.jwt.sub,
                    cart_id: req.session.cart_id,
                    shipping: req.session.shipping,
                };

                // await response 
                const response = await postCheckout(data);

                req.session.order_id = response.order.id;

                // redirect to get order confirmation  
                res.redirect(`/checkout/order/confirmation`);
            } else {
                // redirect if required session info is missing
                res.redirect('/cart/checkout');
            }

        } catch(err) {
            if (err.status === 400) {
                res.redirect('/checkout/payment');
            }
            next(err);
        }
    });
}