const router = require('express').Router();

module.exports = (app) => {

    app.use('/', router);

    router.get('/', (req, res, next) => {
        res.status(200).json('Hello World');
    });

}