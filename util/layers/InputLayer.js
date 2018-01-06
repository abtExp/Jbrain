const Layer = require('./Layer');

class InputLayer extends Layer {
    constructor(config) {
        config.type = 'input';
        super(config);
    }
}

module.exports = InputLayer;