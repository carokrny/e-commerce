const router = require('express').Router();
const { postShipping } = require('../../services/checkoutService');
const { checkoutAuth } = require('../../lib/customAuth/jwtAuth');

module.exports = (app) => {

    app.use('/shipping', router);

    /**
    * @swagger
    * /checkout/shipping:
    *   get:
    *     tags:
    *       - Checkout
    *     description: Returns shipping info forms
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: Shipping info form.
    *       302:
    *         description: Redirects to /cart if user is not authorized
    */ 
    router.get('/', checkoutAuth, (req, res, next) => {
        res.status(200).json(`Form to fill out shipping info goes here. 
                            If primary_address_id !== null, automatically select it.`);
    });

    /**
    * @swagger
    * /checkout/shipping:
    *   post:
    *     tags:
    *       - Checkout
    *     description: User selects existing address for shipping or creates new address
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: first_name
    *         description: user's first name
    *         in: body
    *         required: true
    *         type: string
    *       - name: last_name
    *         description: user's last name
    *         in: body
    *         required: true
    *         type: string
    *       - name: address_id
    *         description: id of existing address
    *         in: body
    *         required: false
    *         type: integer
    *       - name: address1
    *         description: first line of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: address2
    *         description: second line of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: city
    *         description: city of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: zip
    *         description: zip code of user's new address
    *         in: body
    *         required: false
    *         type: string
    *       - name: country
    *         description: country of user's new address
    *         in: body
    *         required: false
    *         type: string
    *     responses:
    *       302: 
    *         description: Redirects to /payment if shipping info input. Invalid inputs redirects to /shipping. Unauth user redirects to /cart.
    */
    router.post('/', checkoutAuth, async (req, res, next) => {
        try {
            // grab user_id from request
            const user_id = req.jwt.sub;

            // await response 
            const response = await postShipping({ ...req.body, user_id: user_id });

            // attach address to session
            req.session.shipping = response.shipping;

            // redirect to get payment info 
            res.redirect('/checkout/payment');
        } catch(err) {
            if (err.status === 400) {
                res.redirect('/checkout/shipping');
            }
            next(err);
        }
    });

}