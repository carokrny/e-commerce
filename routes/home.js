const router = require('express').Router();

module.exports = (app) => {

    app.use('/', router);

    router.get('/', (req, res, next) => {
        res.send('Hello World');
    });

}