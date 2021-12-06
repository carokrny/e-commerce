const router = require('express').Router();
const accountService = require('../services/accountService');

module.exports = (app, passport) => {

    app.use('/account', router);

    // GET user info when user is logged into account
    router.get('/', passport.authenticate('jwt', {session: false}), (req, res ,next) => {
        res.json(req.user);
    });
    
    // GET user info when user is logged into account
    router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res ,next) => {
        res.json(req.user);
    });

    // PUT user update when user is logged into account
    router.put('/:id', passport.authenticate('jwt', {session: false}), async (req, res ,next) => {
        try {
            const updatedUser = await accountService(req.body, req.params.id);
            res.status(200).json(updatedUser);
        } catch(err) {
            next(err);
        }
    });

}