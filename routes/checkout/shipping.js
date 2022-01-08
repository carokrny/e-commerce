const router = require('express').Router();
const { postShipping } = require('../../services/checkoutService');
const { getAllAddresses } = require('../../services/addressService');
const { checkoutAuth } = require('../../lib/customAuth/jwtAuth');

module.exports = (app) => {

    app.use('/shipping', router);

    /**
    * @swagger
    * /checkout/shipping:
    *   get:
    *     tags:
    *       - Checkout
    *     description: Returns info for user to select shipping address
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: Info about user's saved addresses
    *         schema:
    *           type: object
    *           properties: 
    *             addresses:
    *               type: array
    *               items: 
    *                 $ref: '#/definitions/Address'
    *       302:
    *         description: |
    *           Redirects to /cart if user is not authorized
    */ 
    router.get('/', checkoutAuth, async (req, res, next) => {
        try {
            // grab user_id
            const user_id = req.jwt.sub;

            // get addresses
            const response = await getAllAddresses(user_id);

            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    /**
    * @swagger
    * /checkout/shipping:
    *   post:
    *     tags:
    *       - Checkout
    *     description: |
    *       User selects existing address for shipping or creates new address
    *       Send either (a) address_id of address for shipping 
    *       Or (b) post a new address
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: address_id
    *         description: id of existing address
    *         in: body
    *         required: false
    *         type: integer
    *       - name: address1
    *         description: first line of new address for shipping recipient
    *         in: body
    *         required: false
    *         type: string
    *       - name: address2
    *         description: second line of new address for shipping recipient
    *         in: body
    *         required: false
    *         type: string
    *       - name: city
    *         description: city of new address for shipping recipient
    *         in: body
    *         required: false
    *         type: string
    *       - name: zip
    *         description: zip code of new address for shipping recipient
    *         in: body
    *         required: false
    *         type: string
    *       - name: country
    *         description: country of new address for shipping recipient
    *         in: body
    *         required: false
    *         type: string
    *       - name: first_name
    *         description: first name of new address for shipping recipient
    *         required: false
    *         type: string
    *       - name: last_name
    *         description: last name of new address for shipping recipient
    *         in: body
    *         required: false
    *         type: string
    *     responses:
    *       302: 
    *         description: |
    *           Redirects to checkout/payment if shipping info input. 
    *           Redirects to checkout/shipping if inputs invalid. 
    *           Redirects to /cart if user not authenticated.
    */
    router.post('/', checkoutAuth, async (req, res, next) => {
        try {
            // grab user_id from request
            const user_id = req.jwt.sub;

            // await response 
            const response = await postShipping({ ...req.body, user_id: user_id });

            // attach shipping address to session
            req.session.shipping_address_id = response.shipping.id;

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