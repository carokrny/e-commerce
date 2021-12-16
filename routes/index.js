const homeRouter = require('./shopRoutes/home');
const productsRouter = require('./shopRoutes/products');
const cartRouter = require('./shopRoutes/cart');
const registerRouter = require('./authRoutes/register');
const loginRouter = require('./authRoutes/login');
const logoutRouter = require('./authRoutes/logout');
const accountRouter = require('./accountRoutes/account');


module.exports = (app) => {
    homeRouter(app);
    registerRouter(app);
    loginRouter(app);
    logoutRouter(app);
    accountRouter(app);
    productsRouter(app);
    cartRouter(app);
}