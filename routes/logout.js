const router = require('express').Router();

module.exports = (app, passport) => {

    app.use('/logout', router);

    router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
        req.logout();
        res.redirect('/login');
    })
}