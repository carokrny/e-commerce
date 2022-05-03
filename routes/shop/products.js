const router = require('express').Router();
const { getAll, 
    getById,
    getCategory, 
    getSearch } = require('../../services/productService');

module.exports = (app) => {

    app.use('/products', router);

    /**
    * @swagger
    * components:
    *   schemas:
    *     category:
    *       type: string
    *       pattern: ^[A-Za-z0-9 '#:_-]*$
    *       example: 'tops'
    *     query:
    *       type: string
    *       pattern: ^[A-Za-z0-9 '#:_-]*$
    *       example: 'pants'
    *     Product:
    *       type: object
    *       properties:
    *         id:
    *           $ref: '#/components/schemas/id'
    *         name:
    *           $ref: '#/components/schemas/product_name'
    *         price:
    *           $ref: '#/components/schemas/price'
    *         description:
    *           $ref: '#/components/schemas/product_description'
    *         quantity: 
    *           $ref: '#/components/schemas/quantity'
    *         in_stock:
    *           $ref: '#/components/schemas/in_stock'
    *         category:
    *           $ref: '#/components/schemas/category'
    *         created:
    *           $ref: '#/components/schemas/date_time'
    *         modified:
    *           $ref: '#/components/schemas/date_time'
    *
    */

    /**
    * @swagger
    * /products:
    *   get:
    *     tags:
    *       - Shop
    *     summary: Returns all products
    *     responses:
    *       200:
    *         description: An array of Product objects.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 products:
    *                   type: array
    *                   items: 
    *                     $ref: '#/components/schemas/Product'
    */ 
    router.get('/', async (req, res, next) => {
        try {
            const response = await getAll();
            res.status(200).json(response);
        } catch(err) { 
            next(err)
        }
    });

    /**
    * @swagger
    * /products/search:
    *   get:
    *     tags:
    *       - Shop
    *     summary: Returns products in query
    *     parameters:
    *       - name: q
    *         description: search query
    *         in: query
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/query'
    *     responses:
    *       200:
    *         description: An array of Product objects.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 products:
    *                   type: array
    *                   items: 
    *                     $ref: '#/components/schemas/Product'
    *       400: 
    *         $ref: '#/components/responses/InputsError'
    *       404: 
    *         description: No products matching search query.
    */ 
    router.get('/search', async (req, res, next) => {
        try {
            const query = req.query;
            const response = await getSearch(query);
            res.status(200).json(response);
        } catch(err) { 
            next(err)
        }
    });

    /**
    * @swagger
    * /products/{product_id}:
    *   get:
    *     tags:
    *       - Shop
    *     summary: Returns products with associated ID
    *     parameters:
    *       - name: product_id
    *         description: ID of product
    *         in: path
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/product_id'
    *     responses:
    *       200:
    *         description: A Product object.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 product: 
    *                   $ref: '#/components/schemas/Product'
    *       404: 
    *         description: Product with ID not found.
    */ 
    router.get('/:product_id', async (req, res, next) => {
        try {
            const product_id = req.params.product_id
            const response = await getById(product_id);
            res.status(200).json(response);
        } catch(err) { 
            next(err)
        }
    });

    /**
    * @swagger
    * /products/category/{category}:
    *   get:
    *     tags:
    *       - Shop
    *     summary: Returns products in category
    *     parameters:
    *       - name: category
    *         description: category to filter products
    *         in: path
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/category'
    *     responses:
    *       200:
    *         description: An array of Product objects.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 products:
    *                   type: array
    *                   items: 
    *                     $ref: '#/components/schemas/Product'
    *       404: 
    *         description: No products matching category.
    */ 
    router.get('/category/:category', async (req, res, next) => {
        try {
            const category = req.params.category;
            const response = await getCategory(category);
            res.status(200).json(response);
        } catch(err) { 
            next(err)
        }
    });
}