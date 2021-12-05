const router = require('express').Router();
const homePage = require('../templates/homePage');

module.exports = (app) => {

    app.use('/', router);

    router.get('/', (req, res, next) => {
        res.send(homePage);
    });

}