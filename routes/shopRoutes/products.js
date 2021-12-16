const router = require('express').Router();
const { getAll, getById, getCategory, getSearch } = require('../../services/productService');

module.exports = (app) => {

    app.use('/products', router);

    // GET all products
    router.get('/', async (req, res, next) => {
        try {
            const response = await getAll();
            res.status(200).json(response);
        } catch(err) { 
            next(err)
        }
    });

    // GET products by search query 
    router.get('/search', async (req, res, next) => {
        try {
            const query = req.query;
            const response = await getSearch(query);
            res.status(200).json(response);
        } catch(err) { 
            next(err)
        }
    });

    // GET product by id 
    router.get('/:product_id', async (req, res, next) => {
        try {
            const product_id = req.params.product_id
            const response = await getById(product_id);
            res.status(200).json(response);
        } catch(err) { 
            next(err)
        }
    });

    // GET products by category 
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