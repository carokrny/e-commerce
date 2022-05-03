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
    *         description: returns csrfToken.
    */ 
    router.get('/', (req, res, next) => {
        res.status(200).json({csrfToken: req.csrfToken()});
    });

}