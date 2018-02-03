const Layer = require('./Layer');
const { Ndarray } = require('vecto');

class ConnectedLayer extends Layer {
    constructor(config) {
        config.type = 'connected';
        config.regularizer = null;
        super(config);
        this.weights = new Ndarray({ shape: this.shape, dtype: 'float32' });
        this.biases = new Ndarray({ shape: [this.shape[0], 1], dtype: 'float32', initializer: 'zeros' });
        this.initialize('relu');
        this.activation = new Ndarray({ shape: [this.shape[0], null], dtype: 'float32', initializer: 'zeros' });
    }
}

module.exports = ConnectedLayer;