const handler = require('./controller.js');

let routers = {
    '': handler.index,
};

module.exports = routers;