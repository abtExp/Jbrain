/** 
 * Defining The Layers Of The Network
 * 
 * Provides An Interface For Creating Different Layers
 * Like (Connected, Convolutional, Pooling, Reccurent)
 * 
 */

const { Ndarray, math, core } = require('vecto'),
    activ = require('../activ'), { weighted_input } = require('../net_util');


class Layer {
    constructor(config) {
        if (config.type !== 'input') {
            this.trainable = config.trainable || true;
            this.shape = config.shape;
            this.input = config.input ? config.input.activation : null;
            this.weightsInit = config.weightsInit || 'xavier';
            this.activationFunction = this.setActivation(config.activationFunction);
            this.regularizer = config.regularizer || null;
        } else this.shape = config.shape;
        this.type = config.type;
        this.name = config.name || config.type;
    }

    fire() {
        let z = weighted_input(this.weights, this.input, this.biases),
            a = this.activationFunction ? this.activationFunction(z) : z;
        this.activation.resize(core.calcShape(a));
        this.activation.arrange(a);
        this.z = z;
        this.activ_ = this.activationFunction.dash(z);
    }

    initialize(activ) {
        let factor;
        if (this.weightsInit === 'xavier') {
            if (activ === 'relu') factor = 2;
            else factor = 1;
            this.weights.fill('custom', () => (Math.random() * Math.pow((factor / this.weights.shape[1]), 0.5)));
        } else this.weights.fill('linear');
    }

    calcLayerShape(configShape, activationShape) {
        console.log(configShape);
        console.log(activationShape);
        if (configShape[configShape.length - 1] !== activationShape[0]) {
            configShape[configShape.length - 1] = activationShape[0];
        }
        console.log(configShape);
        return configShape;
    }

    setActivation(afunc) {
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
}

module.exports = Layer;