/* Defining The Layers Of The Network
 * Provides An Interface For Creating Every Type Of Neural Network
 * Like (Fully Connected, Convolutional, Convolutional With Pooling,
 *       Reccurent, LSTM etc.)
 * And Also Provides An Easy And Fast Way To Perform ML Tasks
 */

const { Ndarray, math } = require('vecto');

module.exports = class Layer {
    constructor(config, activation, /* initializer = 'xavier' */ ) {
        if (config.constructor.name === 'Object') constructLayer(this, config);
        else connectedProps(this, { shape: config });
    }

    // Calculates activation for this layer
    fire() {
        const { weighted_input } = require('../util/net_util');
        let z = weighted_input(this.weights.array, this.input, this.biases.array),
            a = this.activation_fn(z);
        return [a, z];
    }

    //Performs activ_dash
    activ_dash(z) {
        return this.activation_fn.dash(z);
    }

}

function set_activation(afunc) {
    const activ = require('./activ');

    switch (afunc) {
        case 'sigmoid':
            return activ.sigmoid;

        case 'softmax':
            return activ.softmax;

        case 'relu':
            return activ.relu;

        case 'tanh':
            return activ.tanh;

        default:
            return null;
    }
}

function getInit(initializer) {
    if (initializer === 'xavier') return function(math) {
        if (this.actvation === 'relu') factor = 2
        else factor = 1
        this.weights.arrange(math.sqrt(math.divide(factor, this.weights.shape[1])));
    }
    else this.weights.arrange();
}

function convProps(layer, config) {
    // layer.kernel = config.kernel;
    // layer.stride = config.stride;
    // layer.fmaps = config.fmaps;
    // layer.activation = config.activation;
    // layer.weights = new Ndarray([layer.fmaps, layer.kernel[0] * layer.kernel[1]]);
    // layer.biases = new Ndarray([layer.fmaps, 1]);
}

function poolProps(layer, config) {
    // layer.kernel = config.kernel;
    // layer.stride = config.stride;
    // layer.fmaps = config.fmaps;
    // layer.activation = config.activation;
    // layer.weights = new Ndarray([layer.fmaps, layer.kernel[0] * layer.kernel[1]]);
    // layer.biases = new Ndarray([layer.fmaps, 1]);
}

function convPoolProps(layer, config) {
    // Todo
}

function connectedProps(layer, config) {
    layer.type = 'connected';
    layer.activation = set_activation(config.activation) || set_activation('tanh');
    layer.weights = new Ndarray(config.shape, 'float32');
    layer.biases = Ndarray.zeroes([config.shape[0], 1], 'float32');
}

function constructLayer(layer, config) {
    layer.type = config.type || 'connected';
    if (config.type === 'conv') convProps(layer, config);
    else if (config.type === 'pool') poolProps(layer, config);
    else if (config.type === 'conv2pool') convPoolProps(layer, config);
    else if (config.type === 'connected') connectedProps(layer, config);
}