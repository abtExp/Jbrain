const Recurrent = require('../Models/Recurrent');

class RNN extends Recurrent {
    constructor({
        depth = 1,
        input = null,
        bi_directional = false,
        stateActivation = 'tanh',
        activationFunction = 'softmax'
    } = {}) {
        super();
        this.activationFunction = activationFunction;
        this.stateActivation = stateActivation;
        this.layers = [];
    }

}

module.exports = RNN;