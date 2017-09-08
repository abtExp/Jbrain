'use strict';

const Optimizer = require('./optimizer_class');

class GradientDescentOptimizer extends Optimizer {
    constructor(network) {
        super(network);
    }

    GD(neta, itrns, opt) {
        let momentum = opt.momentum || false,
            beta = opt.beta || 0.9;

        if (momentum) {
            let vdw = [],
                vdb = [];
            for (let i = 0; i < this.layers.length; i++) {
                vdw.push(ndarray.zeroes(this.layers[i].weights.shape));
                vdb.push(ndarray.zeroes(this.layers[i].biases.shape));
            }
            for (let t = 0; t < itrns; t++) {
                let activations = [],
                    z = [],
                    dw = [],
                    db = [],
                    activ_ = [];
                [activations, z, activ_] = this.feedForward(this.features);
                [dw, db] = this.backprop(activations, this.labels, activ_);
                for (let l = 0; l < this.layers.length; l++) {
                    vdw[l].arrange(math.sum(math.product(vdw[l].array, beta), math.product(dw[l].array, (1 - beta))));
                    vdb[l].arrange(math.sum(math.product(vdb[l].array, beta), math.product(db[l].array, (1 - beta))));
                    this.layers[l].weights.arrange(math.sum(this.layers[l].w.array, math.product(vdw[l].array, (-neta))));
                    this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(vdb[l].array, (-neta))));
                }
            }
        } else {
            for (let t = 0; t < itrns; t++) {
                let activations = [],
                    z = [],
                    dw = [],
                    db = [],
                    activ_ = [];
                [activations, z, activ_] = this.feedForward(this.features);
                [dw, db] = this.backprop(activations, this.labels, activ_);
                for (let l = 0; l < w.length; l++) {
                    this.layers[l].weights.arrange(math.sum(this.layers[l].weights.array, math.product(dw[l].array, (-neta))));
                    this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(db[l].array, (-neta))));
                }
            }
        }
    }


    SGD(network, neta, epoch, m, opt) {

    }

    //MBGD(neta, X, Y, epoch, m, W, b, dw, db, momentum = !!Boolean!!, lrdecay = !!Boolean!!, ldecfact, beta) {
    //  for (i in epoch) {
    //   shuffle(X, Y)
    //    mbatches = [X[i * m - i + 1 * m]]
    //  for (mx, my in mbatches) {
    //    W = W - neta / m * dw //(for current batch)
    //}
    //}

    //}
}

module.exports = GradientDescentOptimizer;