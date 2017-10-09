'use strict';

const Optimizer = require('./optimizerClass');

/* Caution : Heavily Unoptimized */

// Needs Testing

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
            this.preProcecss('gd');
            for (let t = 0; t < itrns; t++) {
                let dw, db;
                [dw, db] = this.Props(this.features, this.labels);
                for (let l = 0; l < this.layers.length; l++) {
                    vdw[l].arrange(math.sum(math.product(vdw[l].array, beta), math.product(dw[l].array, (1 - beta))));
                    vdb[l].arrange(math.sum(math.product(vdb[l].array, beta), math.product(db[l].array, (1 - beta))));
                    this.layers[l].weights.arrange(math.sum(this.layers[l].w.array, math.product(vdw[l].array, (-neta))));
                    this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(vdb[l].array, (-neta))));
                }
            }
        } else {
            for (let t = 0; t < itrns; t++) {
                let dw, db;
                [dw, db] = this.Props(this.features, this.labels);
                for (let l = 0; l < this.layers.length; l++) {
                    this.layers[l].weights.arrange(math.sum(this.layers[l].weights.array, math.product(dw[l].array, (-neta))));
                    this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(db[l].array, (-neta))));
                }
            }
        }
    }


    MBGD(neta, epoch, m, opt) {
        if (opt.momentum) {
            this.preProcess('mbgd');
            for (let i = 0; i < epoch; i++) {
                let batches_x, batches_y;
                [batches_x, batches_y] = this.formBatches(m);
                for (let b = 0; b < batches_x.length; b++) {
                    let dw, db;
                    [dw, db] = this.Props(batches_x[b], batches_y[b]);
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
                let batches_x, btaches_y;
                [batches_x, batches_y] = this.formBatches(m);
                for (let b = 0; b < batches_x.length; b++) {
                    let dw, db;
                    [dw, db] = this.Props(batches_x, batches_y);
                    for (let l = 0; l < this.layers.length; l++) {
                        this.layers[l].weights.arrange(math.sum(this.layers[l].weights.array, math.product(dw[l].array, (-neta))));
                        this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(db[l].array, (-neta))));
                    }
                }
            }
        }
    }

    SGD(neta, epoch, m, opt) {
        if (opt.momentum) {
            this.preProcess('sgd');
            for (let t = 0; t < itrns; t++) {
                for (let i = 0; i < this.features.length; i++) {
                    let dw, db;
                    [dw, db] = this.Props(this.features[i], this.labels[i]);
                    for (let l = 0; l < this.layers.length; l++) {
                        vdw[l].arrange(math.sum(math.product(vdw[l].array, beta), math.product(dw[l].array, (1 - beta))));
                        vdb[l].arrange(math.sum(math.product(vdb[l].array, beta), math.product(db[l].array, (1 - beta))));
                        this.layers[l].weights.arrange(math.sum(this.layers[l].w.array, math.product(vdw[l].array, (-neta))));
                        this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(vdb[l].array, (-neta))));
                    }
                }
            }
        } else {
            for (let t = 0; t < itrns; t++) {
                for (let i = 0; i < this.features.length; i++) {
                    [dw, db] = this.Props(this.features[i], this.labels[i]);
                    for (let l = 0; l < this.layers.length; l++) {
                        this.layers[l].weights.arrange(math.sum(this.layers[l].weights.array, math.product(dw[l].array, (-neta))));
                        this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(db[l].array, (-neta))));
                    }
                }
            }
        }
    }
}

module.exports = GradientDescentOptimizer;