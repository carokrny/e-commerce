const router = require('express').Router();
const { isAuth } = require('../../lib/jwtAuth');

module.exports = (app) => {

    app.use('/logout', router);

    router.post('/', isAuth, (req, res, next) => {
        delete req.jwt;
        res.status(200).json('You have successfully been logged out.');
    })
}