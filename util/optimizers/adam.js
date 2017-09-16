'use strict';

/* Currently only for batch operations , Caution : Not Optimized */

// Needs Testing

const Optimizer = require('./optimizer_class');

class AdamOptimizer extends Optimizer {
    constructor(network) {
        super(network);
    }

    optimize(neta, itrns, opt) {
        opt = opt || {};
        let beta1 = opt.beta1 || 0.9,
            beta2 = opt.beta2 || 0.999,
            epsilon = opt.epsilon || 1e-6;
        this.preProcecss('adam');
        for (let i = 0; i < itrns; i++) {
            let dw, db;
            [dw, db] = this.Props(this.features, this.labels);
            for (let l = 0; l < this.layers.length; l++) {
                vdw[l].arrange(this.math.sum(this.math.product(vdw[l].array, beta1), this.math.product(dw[l].array, (1 - beta1))));
                vdb[l].arrange(this.math.sum(this.math.product(vdb[l].array, beta1), this.math.product(db[l].array, (1 - beta1))));
                sdw[l].arrange(this.math.sum(this.math.product(vdw[l].array, beta2), this.math.product(this.math.pow(dw[l].array, 2), (1 - beta2))));
                sdb[l].arrange(this.math.sum(this.math.product(vdb[l].array, beta2), this.math.product(this.math.pow(db[l].array, 2), (1 - beta2))));
                vdwcorr[l].arrange(this.math.divide(vdw[l].array, (1 - (beta1 ^ (i + 1)))));
                vdbcorr[l].arrange(this.math.divide(vdb[l].array, (1 - (beta1 ^ (i + 1)))));
                sdwcorr[l].arrange(this.math.divide(sdw[l].array, (1 - (beta2 ^ (i + 1)))));
                sdbcorr[l].arrange(this.math.divide(sdb[l].array, (1 - (beta2 ^ (i + 1)))));
                this.layers[l].weights.arrange(this.math.sum(this.layers[l].weights.array, this.math.product(this.math.divide(vdwcorr[l].array, this.math.sum(this.math.sqrt(sdwcorr[l].array), epsilon)), (-neta))));
                this.layers[l].biases.arrange(this.math.sum(this.layers[l].biases.array, this.math.product(this.math.divide(vdbcorr[l].array, this.math.sum(this.math.sqrt(sdbcorr[l].array), epsilon)), (-neta))));
            }
        }
    }
}

module.exports = AdamOptimizer;