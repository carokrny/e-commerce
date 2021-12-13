const homeRouter = require('./openRoutes/home');
const productsRouter = require('./openRoutes/products');
const cartRouter = require('./openRoutes/cart');
const registerRouter = require('./authRoutes/register');
const loginRouter = require('./authRoutes/login');
const logoutRouter = require('./authRoutes/logout');
const accountRouter = require('./protectedRoutes/account');


module.exports = (app) => {
    homeRouter(app);
    registerRouter(app);
    loginRouter(app);
    logoutRouter(app);
    accountRouter(app);
    productsRouter(app);
    cartRouter(app);
}