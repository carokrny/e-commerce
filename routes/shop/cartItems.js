const router = require('express').Router({ mergeParams : true });
const { getCartItem, 
    postCartItem, 
    putCartItem, 
    deleteCartItem } = require('../../services/cartItemService');

module.exports = (app) => {

    app.use('/item', router);

    /**
    * @swagger
    * /cart/item/{product_id}:
    *   post:
    *     tags:
    *       - Shop
    *     description: Creates and returns new item in cart
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         type: integer
    *       - name: product_id
    *         description: ID assocaited with Product
    *         in: path
    *         required: true
    *         type: integer
    *       - name: quantity
    *         description: quantity of product being added to Cart
    *         in: body
    *         required: true
    *         type: integer
    *     responses:
    *       201:
    *         description: A CartItem object.
    *         schema:
    *           $ref: '#/definitions/CartItem'
    *       400: 
    *         description: Invalid inputs.
    *       404: 
    *         description: Cart or Product not found.
    */
    router.post('/:product_id', async (req, res ,next) => {
        try {
            // grab cart_id from express session
            const cart_id = req.session.cart_id ? req.session.cart_id : null;
            // grab product_id and quantity from express objects
            const { product_id } = req.params;
            const { quantity } = req.body;

            const response = await postCartItem({ cart_id, product_id, quantity });

            res.status(201).json(response);
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /cart/item/{product_id}:
    *   get:
    *     tags:
    *       - Shop
    *     description: Returns cart item
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         type: integer
    *       - name: product_id
    *         description: ID assocaited with Product
    *         in: path
    *         required: true
    *         type: integer
    *     responses:
    *       200:
    *         description: A CartItem object.
    *         schema:
    *           $ref: '#/definitions/CartItem'
    *       400: 
    *         description: Invalid inputs.
    *       404: 
    *         description: Cart item not found.
    */
    router.get('/:product_id', async (req, res ,next) => {
        try {
            // grab cart_id from express session
            const cart_id = req.session.cart_id ? req.session.cart_id : null;
            // grab product_id from express params object
            const { product_id } = req.params;

            const response = await getCartItem({ cart_id, product_id });
            
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /cart/item/{product_id}:
    *   put:
    *     tags:
    *       - Shop
    *     description: Updates and returns new item in cart
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         type: integer
    *       - name: product_id
    *         description: ID assocaited with Product
    *         in: path
    *         required: true
    *         type: integer
    *       - name: quantity
    *         description: quantity of product in added to Cart
    *         in: body
    *         required: true
    *         type: integer
    *     responses:
    *       200:
    *         description: A CartItem object.
    *         schema:
    *           $ref: '#/definitions/CartItem'
    *       400: 
    *         description: Invalid inputs.
    *       404: 
    *         description: Cart item not found.
    */
    router.put('/:product_id', async (req, res ,next) => {
        try {
            // grab cart_id from express session
            const cart_id = req.session.cart_id ? req.session.cart_id : null;
            // grab product_id and quantity from express objects
            const { product_id } = req.params;
            const { quantity } = req.body;

            const response = await putCartItem({ cart_id, product_id, quantity });

            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /cart/item/{product_id}:
    *   delete:
    *     tags:
    *       - Shop
    *     description: Returns cart item
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         type: integer
    *       - name: product_id
    *         description: ID assocaited with Product
    *         in: path
    *         required: true
    *         type: integer
    *     responses:
    *       200:
    *         description: A CartItem object.
    *         schema:
    *           $ref: '#/definitions/CartItem'
    *       400: 
    *         description: Invalid inputs.
    *       404: 
    *         description: Cart item not found.
    */
    router.delete('/:product_id', async (req, res ,next) => {
        try {
            // grab cart_id from express session
            const cart_id = req.session.cart_id ? req.session.cart_id : null;
            // grab product_id from express params object
            const { product_id } = req.params;

            const response = await deleteCartItem({ cart_id, product_id });

            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

}