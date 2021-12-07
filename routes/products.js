const router = require('express').Router();
const { getAll, getById, getCategory } = require('../services/productService');

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

    // GET product by id 
    router.get('/:id', async (req, res, next) => {
        try {
            const response = await getById(req.params.id);
            res.status(200).json(response);
        } catch(err) { 
            next(err)
        }
    });

    // GET products by category 
    router.get('/category/:category', async (req, res, next) => {
        try {
            const response = await getCategory(req.params.category);
            res.status(200).json(response);
        } catch(err) { 
            next(err)
        }
    });

}