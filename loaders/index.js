const expressLoader = require('./express');
const routerLoader = require('../routes');

module.exports = async (app) => {
    await expressLoader(app);

    await routerLoader(app);
}