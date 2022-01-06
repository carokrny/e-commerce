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
    * definition:
    *   Cart:
    *     type: object
    *     properties:
    *       id:
    *         type: integer
    *       user_id:
    *         type: integer
    *       created:
    *         type: string
    *         format: date-time
    *       modified:
    *         type: string
    *         format: date-time
    *   CartItem:
    *     type: object
    *     properties:
    *       cart_id:
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
    * /cart:
    *   post:
    *     tags:
    *       - Shop
    *     description: Creates and returns new cart
    *     produces:
    *       - application/json
    *     responses:
    *       201:
    *         description: A Cart object.
    *         schema:
    *           $ref: '#/definitions/Cart'
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
    *     description: Returns cart with items
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         type: integer
    *     responses:
    *       200:
    *         description: A Cart object and an array of CartItem objects.
    *         schema:
    *           type: object
    *           properties: 
    *               cart:  
    *                 $ref: '#/definitions/Cart'
    *               cartItems:
    *                 type: array
    *                 items: 
    *                   $ref: '#/definitions/CartItem'
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