const router = require('express').Router({ mergeParams : true });
const { getAllOrders, getOneOrder } = require('../../services/orderService');

module.exports = (app) => {
    
    app.use('/orders', router);

    /**
    * @swagger
    * definition:
    *   Order:
    *     type: object
    *     properties:
    *       id:
    *         type: integer
    *       user_id:
    *         type: integer
    *       status:
    *         type: string
    *         enum: 
    *           - pending
    *           - shipped 
    *           - delivered 
    *           - canceled
    *         example: 'pending'
    *       shipping_address_id:
    *         type: integer
    *       billing_address_id:
    *         type: integer
    *       payment_id:
    *         type: integer
    *       total:
    *         type: string
    *         format: money
    *         example: '$50.00'
    *       created:
    *         type: string
    *         format: date-time
    *       modified:
    *         type: string
    *         format: date-time
    *   OrderItem:
    *     type: object
    *     properties:
    *       order_id:
    *         type: integer
    *       product_id:
    *         type: integer
    *       quantity: 
    *         type: integer
    *       name:
    *         type: string
    *       total_price:
    *         type: number
    *         format: money
    *         example: 19.99
    *       description: 
    *         type: string
    *       in_stock:
    *         type: boolean
    *       created:
    *         type: string
    *         format: date-time
    *       modified:
    *         type: string
    *         format: date-time
    *
    */

    /**
    * @swagger
    * /account/orders/all:
    *   get:
    *     tags:
    *       - Account
    *     description: Returns all orders associated with user
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: An array of Order objects.
    *         schema:
    *           type: array 
    *           items: 
    *             $ref: '#/definitions/Order'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
    */ 
    router.get('/all', async (req, res ,next) => {
        try {
            const user_id = req.jwt.sub;

            const response = await getAllOrders(user_id);

            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /account/orders/{order_id}:
    *   get:
    *     tags:
    *       - Account
    *     description: Returns order associated with specified order_id
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: order_id
    *         description: ID of order
    *         in: path
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: An Order object.
    *         schema:
    *           $ref: '#/definitions/Order'
    *       400: 
    *         description: Missing order_id.
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
    *       403: 
    *         description: User not associated with specified order_id.
    *       404: 
    *         description: No order found with specified order_id.
    */ 
    router.get('/:order_id', async (req, res ,next) => {
        try {
            const data = { 
                user_id: req.jwt.sub, 
                order_id: req.params.order_id 
            };

            const response = await getOneOrder(data);

            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });
}