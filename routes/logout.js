const router = require('express').Router();

module.exports = (app, passport) => {

    app.use('/logout', router);

    router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
        req.logout();
        res.status(200).json('You have successfully been logged out.');
    })
}