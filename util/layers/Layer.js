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
            this.shape = this.calcLayerShape(config.shape, config.input.activation.shape);
            this.input = config.input.activation;
            this.weightsInit = config.weightsInit || 'xavier';
            this.activationFunction = this.setActivation(config.activationFunction);
            this.regularizer = config.regularizer.name; // Placeholder, 've to implement regularization
        } else this.shape = config.shape;
        this.type = config.type;
        this.name = config.name || config.type;
        this.activation = new Ndarray({ shape: [this.shape[0], null], dtype: 'float32', initializer: 'zeros' });
    }

    fire() {
        let z = weighted_input(this.weights.array, this.input.array, this.biases.array),
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
        if (configShape[configShape.length - 1] === activationShape[0]) return configShape;
        configShape[configShape.length - 1] = activationShape[0];
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