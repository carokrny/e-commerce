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
    *     description: Logs user out
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: Logout confirmation.
    *       401: 
    *         description: User not authorized to access route.
    *         schema:
    *           $ref: '#/responses/UnauthorizedError'
    */
    router.post('/', isAuth, (req, res, next) => {
        if (req.jwt) delete req.jwt;
        res.clearCookie("access_token");
        res.status(200).json('You have successfully been logged out.');
    })
}