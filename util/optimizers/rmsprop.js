'use strict';

/* Currently Only For Batch Operations, Caution : Not Optimized */

// Needs Testing

const Optimizer = require('./optimizerClass');

class RMSPropOptimizer extends Optimizer {
    constructor(network) {
        super(network);
    }

    optimize(network, neta, itrns, opt) {
        let beta = opt.beta;
        this.preProcecss('rmsprop');
        for (let i = 0; i < itrns; i++) {
            let dw, db;
            [dw, db] = this.Props(this.features, this.labels);
            for (let l = 0; l < this.layers.length; l++) {
                sdw[l].arrange(this.math.sum(this.math.product(sdw[l].array, beta), this.math.product(dw[l].array, (1 - beta))));
                sdb[l].arrange(this.math.sum(this.math.product(sdb[l].array, beta), this.math.product(db[l].array, (1 - beta))));
                this.layers[l].weights.arrange(this.math.sum(this.layers[l].weights.array, this.math.product(this.math.divide(dw[l], this.math.sum(this.math.sqrt(sdw[l]), epsilon)), (-neta))));
                this.layers[l].biases.arrange(this.math.sum(this.layers[l].biases.array, this.math.product(this.math.divide(db[l], this.math.sum(this.math.sqrt(sdb[l]), epsilon)), (-neta))));
            }
        }

    }
}

module.exports = RMSPropOptimizer;