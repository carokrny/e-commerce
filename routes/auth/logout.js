const router = require('express').Router();
const { isAuth } = require('../../lib/customAuth/jwtAuth');

module.exports = (app) => {

    app.use('/logout', router);

    /**
    * @swagger
    * /logout:
    *   post:
    *     tags:
    *       - Auth
    *     summary: Logs user out
    *     security: 
    *       - bearerJWT: []
    *       - cookieJWT: []
    *     responses:
    *       200:
    *         description: Logout confirmation.
    *       401: 
    *         $ref: '#/components/responses/UnauthorizedError'
    */
    router.post('/', isAuth, (req, res, next) => {
        if (req.jwt) delete req.jwt;
        res.clearCookie("access_token");
        res.clearCookie("connect.sid");
        res.status(200).json('You have successfully been logged out.');
    })
}