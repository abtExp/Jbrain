'use strict';

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
            for (let l = 0; l < w.length; l++) {
                sdw[l].arrange(math.sum(math.product(sdw[l].array, beta), math.product(dw[l].array, (1 - beta))));
                sdb[l].arrange(math.sum(math.product(sdb[l].array, beta), math.product(db[l].array, (1 - beta))));
                w[l].arrange(math.sum(w[l].array, math.product(math.divide(dw[l], math.sum(math.sqrt(sdw[l]), epsilon)), (-neta))));
                b[l].arrange(math.sum(b[l].array, math.product(math.divide(db[l], math.sum(math.sqrt(sdb[l]), epsilon)), (-neta))));
            }
        }

    }
}