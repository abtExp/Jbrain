'use strict';

/* Currently only for batch operations , Caution : Not Optimized */

// Needs Testing

const Optimizer = require('./optimizer_class');

class AdamOptimizer extends Optimizer {
    constructor(network) {
        super(network);
    }

    optimize(neta, itrns, opt) {
        const { ndarray, math } = require('../../node_modules/vecto');
        opt = opt || {};
        let beta1 = opt.beta1 || 0.9,
            beta2 = opt.beta2 || 0.999,
            epsilon = opt.epsilon || 1e-6,
            vdw = [],
            vdb = [],
            vdwcorr = [],
            vdbcorr = [],
            sdw = [],
            sdb = [],
            sdwcorr = [],
            sdbcorr = [];
        for (let i = 0; i < this.layers.length; i++) {
            vdw.push(ndarray.zeroes(this.layers[i].weights.shape));
            vdb.push(ndarray.zeroes(this.layers[i].biases.shape));
            vdwcorr.push(ndarray.zeroes(this.layers[i].weights.shape));
            vdbcorr.push(ndarray.zeroes(this.layers[i].biases.shape));
            sdw.push(ndarray.zeroes(this.layers[i].weights.shape));
            sdb.push(ndarray.zeroes(this.layers[i].biases.shape));
            sdwcorr.push(ndarray.zeroes(this.layers[i].weights.shape));
            sdbcorr.push(ndarray.zeroes(this.layers[i].biases.shape));
        }
        for (let i = 0; i < itrns; i++) {
            let activations = [],
                z = [],
                dw = [],
                db = [],
                activ_ = [];
            [activations, z, activ_] = this.feedForward(this.features);
            [dw, db] = this.backprop(activations, this.labels, activ_);
            for (let l = 0; l < this.layers.length; l++) {
                vdw[l].arrange(math.sum(math.product(vdw[l].array, beta1), math.product(dw[l].array, (1 - beta1))));
                vdb[l].arrange(math.sum(math.product(vdb[l].array, beta1), math.product(db[l].array, (1 - beta1))));
                sdw[l].arrange(math.sum(math.product(vdw[l].array, beta2), math.product(math.pow(dw[l].array, 2), (1 - beta2))));
                sdb[l].arrange(math.sum(math.product(vdb[l].array, beta2), math.product(math.pow(db[l].array, 2), (1 - beta2))));
                vdwcorr[l].arrange(math.divide(vdw[l].array, (1 - (beta1 ^ (i + 1)))));
                vdbcorr[l].arrange(math.divide(vdb[l].array, (1 - (beta1 ^ (i + 1)))));
                sdwcorr[l].arrange(math.divide(sdw[l].array, (1 - (beta2 ^ (i + 1)))));
                sdbcorr[l].arrange(math.divide(sdb[l].array, (1 - (beta2 ^ (i + 1)))));
                this.layers[l].weights.arrange(math.sum(this.layers[l].weights.array, math.product(math.divide(vdwcorr[l].array, math.sum(math.sqrt(sdwcorr[l].array), epsilon)), (-neta))));
                this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(math.divide(vdbcorr[l].array, math.sum(math.sqrt(sdbcorr[l].array), epsilon)), (-neta))));
            }
        }
    }
}