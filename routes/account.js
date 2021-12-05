const router = require('express').Router();

module.exports = (app, passport) => {

    app.use('/account', router);

    router.get('/', passport.authenticate('jwt', {session: false}), (req, res ,next) => {
        res.json(req.user);
    });

    // TODO - ADD user CRUD operations

}