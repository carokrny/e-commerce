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
    *     summary: Creates and returns new item in cart
    *     requestBody:
    *       description: body with necessary parameters
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               quantity:
    *                 $ref: '#/components/schemas/quantity'
    *             required:
    *               - quantity
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: product_id
    *         description: ID assocaited with Product
    *         in: path
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/product_id'
    *     responses:
    *       201:
    *         description: A CartItem object.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 cartItem:
    *                   $ref: '#/components/schemas/CartItem'
    *       400: 
    *         $ref: '#/components/responses/InputsError'
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
    *     summary: Returns cart item
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: product_id
    *         description: ID assocaited with Product
    *         in: path
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/product_id'
    *     responses:
    *       200:
    *         description: A CartItem object.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 cartItem:
    *                   $ref: '#/components/schemas/CartItem'
    *       400: 
    *         $ref: '#/components/responses/InputsError'
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
    *     summary: Updates and returns new item in cart
    *     requestBody:
    *       description: body with necessary parameters
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               quantity:
    *                 $ref: '#/components/schemas/quantity'
    *             required:
    *               - quantity
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: product_id
    *         description: ID assocaited with Product
    *         in: path
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/product_id'
    *     responses:
    *       200:
    *         description: A CartItem object.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 cartItem:
    *                   $ref: '#/components/schemas/CartItem'
    *       400: 
    *         $ref: '#/components/responses/InputsError'
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
    *     summary: Deletes and returns cart item
    *     parameters:
    *       - name: cart_id
    *         description: ID associated with Cart
    *         in: cookie
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/id'
    *       - name: product_id
    *         description: ID assocaited with Product
    *         in: path
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/product_id'
    *     responses:
    *       200:
    *         description: A CartItem object.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 cartItem:
    *                   $ref: '#/components/schemas/CartItem'
    *       400: 
    *         $ref: '#/components/responses/InputsError'
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