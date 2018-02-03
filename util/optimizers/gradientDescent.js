'use strict';

const Optimizer = require('./optimizerClass');
const { math } = require('vecto');

/* Caution : Heavily UNOPTIMISED!!! & UNTESTED!!! */

// Needs Testing

class GradientDescentOptimizer extends Optimizer {
    constructor(network) {
        super(network, 2);
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
        let beta = opt.beta || 0.9;
        if (opt.momentum) this.initParams();
        for (let t = 0; t < itrns; t++) {
            let [dw, db] = this.Props(this.features, this.labels);
            if (opt.momentum) {
                this.updateProcess(beta);
                let [vdw, vdb] = this.variablesList;
                dw = vdw;
                db = vdb;
            }
            this.updateWeights(dw, db, neta);
        }
    }


    MBGD(neta, epoch, m, opt) {
        if (opt.momentum) this.initParams();
        for (let i = 0; i < epoch; i++) {
            let [batches_x, batches_y] = this.formBatches(m);
            for (let b = 0; b < batches_x.length; b++) {
                let [dw, db] = this.Props(batches_x[b], batches_y[b]);
                if (opt.momentum) {
                    this.updateProcess(beta);
                    let [vdw, vdb] = this.variablesList;
                    dw = vdw;
                    db = vdb;
                }
                this.updateWeights(dw, db, neta);
            }
        }
    }

    SGD(neta, epoch, m, opt) {
        for (let t = 0; t < epoch; t++) {
            let [features, labels] = this.formBatches(1);
            for (let i = 0; i < features.length; i++) {
                let dw, db;
                [dw, db] = this.Props(features[i], labels[i]);
                this.updateWeights(dw, db, neta);
            }
        }
    }

    updateWeights(dw, db, neta) {
        for (let l = 1; l < this.layers.length; l++) {
            this.layers[l].weights.arrange(math.sum(this.layers[l].weights.array, math.product(dw[l].array, (-neta))));
            this.layers[l].biases.arrange(math.sum(this.layers[l].biases.array, math.product(db[l].array, (-neta))));
        }
    }
}

module.exports = GradientDescentOptimizer;