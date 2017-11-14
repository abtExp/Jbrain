'use strict';

/* Currently Only For Batch Operations, Caution : Not Optimized */

// Needs Testing

// Didn't meant to work for batch, works with sgd

const Optimizer = require('./optimizerClass');

class RMSPropOptimizer extends Optimizer {
    constructor(network) {
        super(network, 2);
    }

    optimize(network, neta, itrns, opt) {
        const { math } = require('vecto');
        let beta = opt.beta || 0.9,
            epsilon = opt.epsilon || 1e-8;
        this.initParams();
        for (let i = 0; i < itrns; i++) {
            let [dw, db] = this.Props(this.features, this.labels);
            this.updateProcess(beta);
            let [sdw, sdb] = this.variablesList;
            for (let l = 0; l < this.layers.length; l++) {
                this.layers[l].weights.arrange(math.sum(this.layers[l].weights.array, math.product(math.divide(dw[l], math.sum(math.sqrt(sdw[l]), epsilon)), (-neta))));
                this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(math.divide(db[l], math.sum(math.sqrt(sdb[l]), epsilon)), (-neta))));
            }
        }

    }
}

module.exports = RMSPropOptimizer;