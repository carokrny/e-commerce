const homeRouter = require('./shop/home');
const productsRouter = require('./shop/products');
const cartRouter = require('./shop/cart');
const checkoutRouter = require('./checkout');
const registerRouter = require('./auth/register');
const loginRouter = require('./auth/login');
const logoutRouter = require('./auth/logout');
const accountRouter = require('./account');


module.exports = (app) => {
    homeRouter(app);
    registerRouter(app);
    loginRouter(app);
    logoutRouter(app);
    accountRouter(app);
    productsRouter(app);
    cartRouter(app);
    checkoutRouter(app);
}