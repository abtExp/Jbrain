module.exports = class lyr {
    constructor(config) {
        const { ndarray } = require('../node_modules/vecto');
        // Make Layers based on the config

    }

    // Calculates activation for this layer
    fire(x) {
        const { weighted_input } = require('../util/net_util');
        let z = weighted_input(this.weights.array, x, this.biases.array),
            a = this.activation_fn(z);
        this.activ_ = this.activ_dash(z);
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