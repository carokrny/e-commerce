const router = require('express').Router();
const { getAll, getById, getByCat } = require('../services/productService');

module.exports = (app) => {

    app.use('/products', router);

    // GET all products
    router.get('/', async (req, res, next) => {
        try {
            const allProd = await getAll();
            res.status(200).json(allProd);
        } catch(err) { 
            next(err)
        }
    });

    // GET product by id 
    router.get('/:id', async (req, res, next) => {
        try {
            const product = await getById(req.params.id);
            res.status(200).json(product);
        } catch(err) { 
            next(err)
        }
    });

    // GET products by category 
    router.get('/category/:category', async (req, res, next) => {
        try {
            const catProd = await getByCat(req.params.category);
            res.status(200).json(catProd);
        } catch(err) { 
            next(err)
        }
    });

}