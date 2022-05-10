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
    *     summary: Adds product of specified quantity to cart and returns new item in cart. Creates a cart if one does not exist.
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
            // grab data needed to get post cart item 
            const data = {
                cart_id: req.session.cart_id || null,
                user_id: req.jwt ? req.jwt.sub : null, 
                product_id: req.params.product_id, 
                quantity: req.body.quantity
            };

            // get response
            const response = await postCartItem(data);

            // attach cart_id to session, in case cart_id changed
            req.session.cart_id = response.cartItem.cart_id;

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
            // grab data needed to get post cart item 
            const data = {
                cart_id: req.session.cart_id || null, 
                product_id: req.params.product_id
            };

            // get response
            const response = await getCartItem(data);
            
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
    *     summary: Updates and returns specified item in cart
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
            // grab data needed to get post cart item 
            const data = {
                cart_id: req.session.cart_id || null,
                user_id: req.jwt ? req.jwt.sub : null, 
                product_id: req.params.product_id, 
                quantity: req.body.quantity
            };

            // get response
            const response = await putCartItem(data);

            // attach cart_id to session, in case cart_id changed
            req.session.cart_id = response.cartItem.cart_id;

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
            // grab data needed to get post cart item 
            const data = {
                cart_id: req.session.cart_id || null,
                user_id: req.jwt ? req.jwt.sub : null, 
                product_id: req.params.product_id
            };

            // get response
            const response = await deleteCartItem(data);

            // attach cart_id to session, in case cart_id changed
            req.session.cart_id = response.cartItem.cart_id;

            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

}