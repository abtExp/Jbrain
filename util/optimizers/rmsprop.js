'use strict';

/* Currently Only For Batch Operations, Caution : Not Optimized */

// Needs Testing

const Optimizer = require('./optimizer_class');

class RMSPropOptimizer extends Optimizer {
    constructor(network) {
        super(network);
    }

    optimize(network, neta, itrns, opt) {
        opt = opt || {};
        let w = network.weights,
            b = network.biases,
            dw = network.dw,
            db = network.db,
            beta = opt.beta,
            sdw = [],
            sdb = [];

        for (let l = 0; l < w.length; l++) {
            sdw.push(ndarray.zeroes(w[l].shape));
            sdb.push(ndarray.zeroes(b[l].shape));
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
                sdw[l].arrange(math.sum(math.product(sdw[l].array, beta), math.product(dw[l].array, (1 - beta))));
                sdb[l].arrange(math.sum(math.product(sdb[l].array, beta), math.product(db[l].array, (1 - beta))));
                this.layers[l].weights.arrange(math.sum(this.layers[l].weights.array, math.product(math.divide(dw[l], math.sum(math.sqrt(sdw[l]), epsilon)), (-neta))));
                this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(math.divide(db[l], math.sum(math.sqrt(sdb[l]), epsilon)), (-neta))));
            }
        }

    }
}