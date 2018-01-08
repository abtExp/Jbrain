const Layer = require('./Layer');
const { Ndarray } = require('vecto');

class InputLayer extends Layer {
    constructor(config) {
        config.type = 'input';
        super(config);
        this.activation = new Ndarray({ shape: [this.shape[0], null], dtype: 'float32', initializer: 'zeros' });
    }

}

module.exports = InputLayer;