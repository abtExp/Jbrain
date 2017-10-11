'use strict';

/* Currently Only For Batch Operations, Caution : Not Optimized */

// Needs Testing

// Didn't meant to work for batch, works with sgd

const Optimizer = require('./optimizerClass');

class RMSPropOptimizer extends Optimizer {
    constructor(network) {
        super(network);
    }

    optimize(network, neta, itrns, opt) {
        let beta = opt.beta || 0.9,
            epsilon = opt.epsilon || 1e-8;
        this.preProcecss('rmsprop');
        for (let i = 0; i < itrns; i++) {
            let dw, db;
            [dw, db] = this.Props(this.features, this.labels);
            this.updateProcess(beta);
            let { sdw, sdb } = this.variablesList;
            for (let l = 0; l < this.layers.length; l++) {
                this.layers[l].weights.arrange(this.math.sum(this.layers[l].weights.array, this.math.product(this.math.divide(dw[l], this.math.sum(this.math.sqrt(sdw[l]), epsilon)), (-neta))));
                this.layers[l].biases.arrange(this.math.sum(this.layers[l].biases.array, this.math.product(this.math.divide(db[l], this.math.sum(this.math.sqrt(sdb[l]), epsilon)), (-neta))));
            }
        }

    }
}

module.exports = RMSPropOptimizer;