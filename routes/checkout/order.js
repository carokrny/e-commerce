const router = require('express').Router();
const { wipeCardData } = require('../../lib/formatUtils');
const { getOneOrder } = require('../../services/orderService');
const { checkoutAuth } = require('../../lib/customAuth/jwtAuth');
const { getCheckoutReview, postCheckout } = require('../../services/checkoutService');

module.exports = (app) => {

    app.use('/order', router);

    /**
    * @swagger
    * /checkout/order:
    *   get:
    *     tags:
    *       - Checkout
    *     description: Returns review before placing order.
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters: 
    *       - name: cart_id
    *         description: user's shopping cart id
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: shipping_address_id
    *         description: shipping address id
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: billing_address_id
    *         description: billing address id
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: payment_id
    *         description: payment method info id
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *     responses:
    *       200:
    *         description: Review of cart, payment method, billing & shipping addresses.
    *         schema:
    *           type: object
    *           properties: 
    *               cart:  
    *                 $ref: '#/definitions/Cart'
    *               cartItems:
    *                 type: array
    *                 items: 
    *                   $ref: '#/definitions/CartItem'
    *               shipping:
    *                 $ref: '#/definitions/Address'
    *               billing:
    *                 $ref: '#/definitions/Address'
    *               payment:
    *                 $ref: '#/definitions/Card'
    *       302:
    *         description: |
    *           Redirects to /cart if user is not authenticated. 
    *           Redirects to /checkout if bad request.
    */ 
    router.get('/', checkoutAuth, async (req, res, next) => {
        try {
            // grab ids needed to get checkout review
            const data = {
                cart_id: req.session.cart_id || null,
                shipping_address_id: req.session.shipping_address_id || null,
                billing_address_id: req.session.billing_address_id || null,
                payment_id: req.session.payment_id || null,
                user_id: req.jwt.sub
            };

            // get review of checkout
            const response = await getCheckoutReview(data);

            // wipe sensitive payment data 
            wipeCardData(response.payment);
            
            res.status(200).json(response);
            
        } catch(err) {
            if(err.status === 400) {
                // redirect if required session info is missing
                res.redirect('/cart/checkout');
            }
            next(err);
        }

    });

    /**
    * @swagger
    * /checkout/order:
    *   post:
    *     tags:
    *       - Checkout
    *     description: Submits order.
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters: 
    *       - name: cart_id
    *         description: user's shopping cart id
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: shipping_address_id
    *         description: shipping address id
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: billing_address_id
    *         description: billing address id
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: payment_id
    *         description: payment method info id
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *     responses:
    *       200:
    *         description: Summary of cart, payment method, billing & shipping addresses.
    *       302:
    *         description: |
    *           Redirects to /checkout/order/confirmation if sucessful.
    *           Redirects to /cart if user is not autheticated.
    *           Redirects to /checkout if bad request
    */ 
    router.post('/', checkoutAuth, async (req, res, next) => {
        try {
            // grab ids needed to get checkout summary
            const data = {
                cart_id: req.session.cart_id || null,
                shipping_address_id: req.session.shipping_address_id || null,
                billing_address_id: req.session.billing_address_id || null,
                payment_id: req.session.payment_id || null,
                user_id: req.jwt.sub
            };

            // create order
            const response = await postCheckout(data);

            // attach order_id to session
            req.session.order_id = response.order.id;
            
            // redirect to get order review  
            res.redirect(`/checkout/order/confirmation`);
        } catch(err) {
            if(err.status === 400) {
                // redirect if required session info is missing
                res.redirect('/cart/checkout');
            }
            next(err);
        }
    });

    /**
    * @swagger
    * /checkout/order/confirmation:
    *   get:
    *     tags:
    *       - Checkout
    *     description: Returns order confirmation
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: order_id
    *         description: ID of order
    *         in: cookie
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: An Order object.
    *         schema:
    *           $ref: '#/definitions/Order'
    *       302:
    *         description: Redirects to /cart if user is not authenticated.
    *       400: 
    *         description: Missing order_id.
    *       403: 
    *         description: User not associated with specified order_id.
    *       404: 
    *         description: No order found with specified order_id.
    */ 
    router.get('/confirmation', checkoutAuth, async (req, res, next) => {
        try {
            const data = { 
                user_id: req.jwt.sub, 
                order_id: req.session.order_id || null
            };

            // query database to confirm order went through 
            const response = await getOneOrder(data);

            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

}