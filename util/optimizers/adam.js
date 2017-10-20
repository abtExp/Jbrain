'use strict';

/* Currently only for batch operations , Caution : Not Optimized */

// Needs Testing

const Optimizer = require('./optimizerClass');

class AdamOptimizer extends Optimizer {

    constructor(network) {
            super(network);
        }
        // Didn't meant to work for batch, works with sgd
    optimize(neta, itrns, opt) {
        const { math } = require('vecto');
        opt = opt || {};
        let beta1 = opt.beta1 || 0.9,
            beta2 = opt.beta2 || 0.999,
            epsilon = opt.epsilon || 1e-6;
        this.preProcecss('adam');
        for (let i = 0; i < itrns; i++) {
            // let dw, db;
            // [dw, db] = 
            this.Props(this.features, this.labels);
            this.updateProcess(beta1, beta2);
            let { vdw, vdb, sdw, sdb } = this.variablesList;
            for (let l = 0; l < this.layers.length; l++) {
                let vdwcorr = new ndarray(this.layers[l].weights.shape),
                    vdbcorr = new ndarray(this.layers[l].biases.shape),
                    sdwcorr = new ndarray(this.layers[l].weights.shape),
                    sdbcorr = new ndarray(this.layers[l].biases.shape);
                vdwcorr.arrange(math.divide(vdw[l].array, (1 - (beta1 ^ (i + 1)))));
                vdbcorr.arrange(math.divide(vdb[l].array, (1 - (beta1 ^ (i + 1)))));
                sdwcorr.arrange(math.divide(sdw[l].array, (1 - (beta2 ^ (i + 1)))));
                sdbcorr.arrange(math.divide(sdb[l].array, (1 - (beta2 ^ (i + 1)))));

                //These two should be broken into individual steps
                this.layers[l].weights.arrange(math.sum(this.layers[l].weights.array, math.product(math.divide(vdwcorr.array, math.sum(math.sqrt(sdwcorr.array), epsilon)), (-neta))));
                this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(math.divide(vdbcorr.array, math.sum(math.sqrt(sdbcorr.array), epsilon)), (-neta))));
            }
        }
    }
}

module.exports = AdamOptimizer;