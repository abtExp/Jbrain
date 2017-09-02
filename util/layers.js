module.exports = class Layer {
    constructor(config) {
        const { ndarray } = require('../node_modules/vecto');
        this.type = config.type;
        this.weights = new ndarray(config.shape, [], dtype = 'float32');
        this.biases = ndarray.zeros([this.neuron_count, 1]);
        this.activation = set_activation(config.activation);

        if (this.type === 'conv') {
            convProps(this, config);
        } else if (this.type === 'pool') {
            poolProps(this, config);
        } else if (this.type === 'conv2pool') {
            convPoolProps(this, config);
        }

    }

    // Calculates activation for this layer
    fire(x) {
        const { weighted_input } = require('../util/net_util');
        let z = weighted_input(this.weights.array, x, this.biases.array),
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

function convProps(layer, config) {
    layer.kernel = config.kernel;
    layer.stride = config.stride;
    layer.fmaps = config.fmaps;
    layer.activation = config.activation;
    layer.weights = new ndarray([layer.fmaps, layer.kernel[0] * layer.kernel[1], 1]);
    layer.biases = new ndarray([layer.fmaps, 1]);
}

function poolProps(layer, config) {
    layer.kernel = config.kernel;
    layer.stride = config.stride;
    layer.fmaps = config.fmaps;
    layer.activation = config.activation;
    layer.weights = new ndarray([layer.fmaps, layer.kernel[0] * layer.kernel[1], 1]);
    layer.biases = new ndarray([layer.fmaps, 1]);
}

function convPoolProps(layer, config) {

}