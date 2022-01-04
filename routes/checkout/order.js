const router = require('express').Router();
const { getOneOrder } = require('../../services/orderService');
const { checkoutAuth } = require('../../lib/customAuth/jwtAuth');

module.exports = (app) => {

    app.use('/order', router);

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
    *         description: Redirects to /cart if user is not authorized
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