'use strict';

module.exports = class Optimizer {
    constructor(network) {
        const { ndarray, math, core } = require('../../node_modules/vecto');
        const { shuffle } = require('../net_util');

        this.shuffle = shuffle;
        this.ndarray = ndarray;
        this.math = math;
        this.core = core;
        this.feedForward = network.feedForward;
        this.layers = network.layers;
        this.costFn = network.constFn;
        this.lyrsCount = network.lyrs_count;
        this.features = network.features;
        this.labels = network.labels;
    }

    /* backpropagation : Calculates the error in activation of every layer 
     * @activations : [array] , The activation of the output layer
     * @labels      : [array] , The labels(desired output) for given input
     * @activ_      : [array] , The g'(z) for current batch
     * Returns      : [delw,delb], delw is an array of ndarrays having error in weights
     *                of every layer and delb is array of ndarrays having errors in biases
     */

    backprop(activations, labels, activ_) {
        let dw = [],
            db = [],
            delta = [];
        for (let i = o; i < this.layers.length; i++) {
            dw.push(this.ndarray.zeroes(this.layers[i].weights.shape));
            db.push(this.ndarray.zeroes(this.layers[i].biases.shape));
        }

        let gradc = this.costFn.grad(labels[this.layers.length - 1], activations[this.layers.length - 1]),
            activ_dash = activ_[this.layers.length - 1];

        delta[(this.layers.length - 1)] = this.math.product(gradc, activ_dash, 'dot');

        for (let i = this.layers.length - 2; i >= 0; i--) {
            delta[i] = this.math.product(this.math.product(delta[i + 1],
                this.layers[i + 1].weights.transpose()), this.layers[i].activ_, 'dot');
        }

        for (let i = 0; i < this.layers.length; i++) {
            dw[i].arrange(this.math.sum(dw[i].array, this.math.product(delta[i], activations[i])));
            db[i].arrange(this.math.sum(db[i].array, delta[i]));
        }

        return [dw, db];
    }
}