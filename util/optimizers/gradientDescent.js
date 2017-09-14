'use strict';

const Optimizer = require('./optimizer_class');

class GradientDescentOptimizer extends Optimizer {
    constructor(network) {
        super(network);
    }

    optimize(neta, epoch, m, opt) {
        if (opt.name === 'gd') {
            this.GD(neta, epoch, opt);
        } else if (opt.name === 'sgd') {
            this.SGD(neta, epoch, m, opt);
        } else {
            this.MBGD(neta, epoch, m, opt);
        }
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
                for (let l = 0; l < this.layers.length; l++) {
                    this.layers[l].weights.arrange(math.sum(this.layers[l].weights.array, math.product(dw[l].array, (-neta))));
                    this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(db[l].array, (-neta))));
                }
            }
        }
    }


    MBGD(neta, epoch, m, opt) {
        if (opt.momentum) {
            let vdw = [],
                vdb = [],
                beta = opt.beta || 0.9;
            for (let l = 0; l < this.layers.length; l++) {
                vdw.push(this.ndarray.zeroes(this.layers[l].weights.shape));
                vdb.push(this.ndarray.zeroes(this.layers[l].biases.shape));
            }
            for (let i = 0; i < epoch; i++) {
                let batches_x, btaches_y, activations, z, activ_, dw, db;
                [batches_x, batches_y] = this.shuffle(this.features, this.labels, m);
                for (let b = 0; b < batches_x.length; b++) {
                    [activations, z, activ_] = this.feedForward(batches_x[b]);
                    [dw, db] = this.backprop(activations, batches_y);
                    for (let l = 0; l < this.layers.length; l++) {
                        vdw[l].arrange(math.sum(math.product(vdw[l].array, beta), math.product(dw[l].array, (1 - beta))));
                        vdb[l].arrange(math.sum(math.product(vdb[l].array, beta), math.product(db[l].array, (1 - beta))));
                        this.layers[l].weights.arrange(math.sum(this.layers[l].w.array, math.product(vdw[l].array, (-neta))));
                        this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(vdb[l].array, (-neta))));
                    }
                }
            }
        } else {
            for (let i = 0; i < epoch; i++) {
                let batches_x, btaches_y, activations, z, activ_, dw, db;
                [batches_x, batches_y] = this.shuffle(this.features, this.labels, m);
                for (let b = 0; b < batches_x.length; b++) {
                    [activations, z, activ_] = this.feedForward(batches_x[b]);
                    [dw, db] = this.backprop(activations, batches_y);
                    for (let l = 0; l < this.layers.length; l++) {
                        this.layers[l].weights.arrange(math.sum(this.layers[l].weights.array, math.product(dw[l].array, (-neta))));
                        this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(db[l].array, (-neta))));
                    }
                }
            }
        }
    }

    SGD(neta, epoch, m, opt) {

    }
}

module.exports = GradientDescentOptimizer;