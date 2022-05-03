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
    *     summary: Returns info for user to select shipping address
    *     security: 
    *       - bearerJWT: []
    *       - cookieJWT: []
    *     responses:
    *       200:
    *         description: Info about user's saved addresses
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 addresses:
    *                   type: array
    *                   items:
    *                     $ref: '#/components/schemas/Address'
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

    /*
   
    * /

    /**
    * @swagger
    * /checkout/shipping:
    *   post:
    *     tags:
    *       - Checkout
    *     summary: User selects existing address or creates new address for shipping
    *     security: 
    *       - bearerJWT: []
    *       - cookieJWT: []
    *     requestBody:
    *       description: body with necessary parameters
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             oneOf:
    *               - type: object
    *                 properties:
    *                   address_id: 
    *                     $ref: '#/components/schemas/id'
    *               - type: object
    *                 properties:
    *                   address1:
    *                     $ref: '#/components/schemas/address1'
    *                   address2:
    *                     $ref: '#/components/schemas/address2'
    *                   city:
    *                     $ref: '#/components/schemas/city'
    *                   state:
    *                     $ref: '#/components/schemas/state'
    *                   zip:
    *                     $ref: '#/components/schemas/zip'
    *                   country:
    *                     $ref: '#/components/schemas/country'
    *                   first_name:
    *                     $ref: '#/components/schemas/first_name'
    *                   last_name:
    *                     $ref: '#/components/schemas/last_name'
    *                   is_primary_address:
    *                     $ref: '#/components/schemas/is_primary_address'
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