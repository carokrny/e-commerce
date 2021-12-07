const homeRouter = require('./home');
const registerRouter = require('./register');
const loginRouter = require('./login');
const logoutRouter = require('./logout');
const accountRouter = require('./account');
const productsRouter = require('./products');
const cartRouter = require('./cart');

module.exports = (app, passport) => {
    homeRouter(app);
    registerRouter(app);
    loginRouter(app, passport);
    logoutRouter(app, passport);
    accountRouter(app, passport);
    productsRouter(app);
    cartRouter(app, passport);
}