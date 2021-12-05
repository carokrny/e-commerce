const router = require('express').Router();

module.exports = (app, passport) => {

    app.use('/logout', router);

    router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
        res.json({
            user: null, 
            token: null, 
            expires: null
        });
    })
}