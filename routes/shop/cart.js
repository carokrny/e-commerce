const router = require('express').Router();
const cartItemsRouter = require('./cartItems');
const { postCart, getCart } = require('../../services/cartService');
const { demiAuth } = require('../../lib/customAuth/jwtAuth');

module.exports = (app) => {

    app.use('/cart', router);

    // demi auth will still allow a user access if they are not logged in
    router.use(demiAuth);

    /**
    * @swagger
    * components:
    *   schemas:
    *     product_id: 
    *       type: integer
    *       minimum: 1
    *       example: 3
    *     quantity: 
    *       type: integer
    *       example: 2
    *       maximum: 100
    *     Cart:
    *       type: object
    *       properties:
    *         id:
    *           $ref: '#/components/schemas/id'
    *         user_id:
    *           $ref: '#/components/schemas/id'
    *         total: 
    *           $ref: '#/components/schemas/price'
    *         num_items:
    *           $ref: '#/components/schemas/num_products'
    *         created:
    *           $ref: '#/components/schemas/date_time'
    *         modified:
    *           $ref: '#/components/schemas/date_time'
    *     CartItem:
    *       type: object
    *       properties:
    *         cart_id:
    *           $ref: '#/components/schemas/id'
    *         product_id:
    *           $ref: '#/components/schemas/product_id'
    *         quantity: 
    *           $ref: '#/components/schemas/quantity'
    *         name:
    *           $ref: '#/components/schemas/product_name'
    *         total_price:
    *           $ref: '#/components/schemas/price'
    *         description: 
    *           $ref: '#/components/schemas/product_description'
    *         in_stock:
    *           $ref: '#/components/schemas/in_stock'
    *         created:
    *           $ref: '#/components/schemas/date_time'
    *         modified:
    *           $ref: '#/components/schemas/date_time'
    *
    */

    /**
    * @swagger
    * /cart:
    *   post:
    *     tags:
    *       - Shop
    *     summary: Creates and returns new cart
    *     responses:
    *       201:
    *         description: A Cart object.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 cart:
    *                   $ref: '#/components/schemas/Cart'
    *         headers: 
    *           Set-Cookie:
    *             schema: 
    *               type: string
    *               example: connect.sid=s%3ApzUS6...; Path=/; HttpOnly; Secure
    *       500: 
    *         description: Server error creating cart.
    */
    router.post('/', async (req, res ,next) => {
        try {
            // grab user_id from json web token 
            const user_id = req.jwt ? req.jwt.sub : null;

            // await response
            const response = await postCart(user_id);

            // attach cart_id to session 
            req.session.cart_id = response.cart.id;

            // send response to client
            res.status(201).json(response);
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /cart:
    *   get:
    *     tags:
    *       - Shop
    *     summary: Returns cart with items 
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         type: integer
    *     responses:
    *       200:
    *         description: A Cart object and an array of CartItem objects.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 cart:
    *                   $ref: '#/components/schemas/Cart'
    *                 cartItems:
    *                   type: array
    *                   items: 
    *                     $ref: '#/components/schemas/CartItem'
    *       400: 
    *         description: Missing cart_id.
    *       404: 
    *         description: Cart associated with cart_id doesn't exist or is empty.
    */ 
    router.get('/', async (req, res ,next) => {
        try {
            // grab cart_id from express session, if it exists
            const cart_id = req.session.cart_id ? req.session.cart_id : null;

            // await response
            const response = await getCart(cart_id);

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // extend route to cart_items
    cartItemsRouter(router);
}