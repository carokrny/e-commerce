const router = require('express').Router({ mergeParams : true });
const { getAllOrders, getOneOrder } = require('../../services/orderService');

module.exports = (app) => {
    
    app.use('/orders', router);

    /**
    * @swagger
    * components:
    *   schemas:
    *     status:
    *       type: string
    *       enum: 
    *         - pending
    *         - shipped 
    *         - delivered 
    *         - canceled
    *       example: 'pending'
    *     price:
    *       type: number
    *       format: money
    *       example: 19.99
    *     num_products: 
    *       type: integer
    *       minimum: 1
    *       example: 3
    *     product_name: 
    *       type: string
    *       pattern: ^[A-Za-z0-9 '#:_-]*$
    *       example: 'socks'
    *     product_description:
    *       type: string
    *       pattern: ^[A-Za-z0-9 '#:_-]*$
    *       example: 'luxurious item imported from Italy'
    *     in_stock: 
    *       type: boolean 
    *       example: true
    * definitions:
    *   Order:
    *     type: object
    *     properties:
    *       id:
    *         $ref: '#/components/schemas/id'
    *       user_id:
    *         $ref: '#/components/schemas/id'
    *       shipping_address_id:
    *         $ref: '#/components/schemas/id'
    *       billing_address_id:
    *         $ref: '#/components/schemas/id'
    *       payment_id:
    *         $ref: '#/components/schemas/id'
    *       stripe_charge_id:
    *         $ref: '#/components/schemas/id'
    *       status:
    *         $ref: '#/components/schemas/status'
    *       amount_charged:
    *         $ref: '#/components/schemas/price'
    *       num_items:
    *         $ref: '#/components/schemas/num_products'
    *       created:
    *         $ref: '#/components/schemas/date_time'
    *       modified:
    *         $ref: '#/components/schemas/date_time'
    *   OrderItem:
    *     type: object
    *     properties:
    *       order_id:
    *         $ref: '#/components/schemas/id'
    *       product_id:
    *         $ref: '#/components/schemas/id'
    *       quantity: 
    *         $ref: '#/components/schemas/num_products'
    *       name:
    *         $ref: '#/components/schemas/product_name'
    *       total_price:
    *         $ref: '#/components/schemas/price'
    *       description: 
    *         $ref: '#/components/schemas/product_description'
    *       in_stock:
    *         $ref: '#/components/schemas/in_stock'
    *       created:
    *         $ref: '#/components/schemas/date_time'
    *       modified:
    *         $ref: '#/components/schemas/date_time'
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
    *           $ref: '#/responses/UnauthorizedError'
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
    *   parameters:
    *     - in: path 
    *       name: order_id
    *       description: ID of order
    *       required: true
    *       type: string
    *   get:
    *     tags:
    *       - Account
    *     description: Returns order associated with specified order_id
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: An Order object.
    *         schema:
    *           $ref: '#/definitions/Order'
    *       400: 
    *         description: Missing order_id.
    *         schema:
    *           $ref: '#/responses/InputsError'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/responses/UnauthorizedError'
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