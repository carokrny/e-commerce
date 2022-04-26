const router = require('express').Router();

module.exports = (app) => {

    app.use('/', router);

    /**
    * @swagger
    * /:
    *   get:
    *     tags:
    *       - Shop
    *     summary: Returns home page
    *     responses:
    *       200:
    *         description: Home page.
    */ 
    router.get('/', (req, res, next) => {
        res.status(200).json('Home page');
    });

}