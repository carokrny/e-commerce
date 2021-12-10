const router = require('express').Router();
const ordersRouter = require('./orders');
const { getAccount, updateAccount } = require('../../services/accountService');
const isAuth = require('../../utils/jwtAuth');

module.exports = (app) => {

    app.use('/account', router);

    router.use(isAuth);

    // GET user info when user is logged into account
    router.get('/', async (req, res ,next) => {
        const user_id = req.jwt.sub;

        const response = await getAccount(user_id);

        res.status(200).json(response);
    });
    
    // GET user info when user is logged into account, superfluous to above route
    router.get('/:user_id', async (req, res ,next) => {
        const user_id = req.params.user_id;

        const response = await getAccount(user_id);

        res.status(200).json(response);
    });

    // PUT user update when user is logged into account
    router.put('/:user_id', async (req, res ,next) => {
        try {
            const user_id = req.params.user_id;
            const data = req.body;

            const response = await updateAccount(data, user_id);
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // extend route to user's orders
    ordersRouter(router);
}