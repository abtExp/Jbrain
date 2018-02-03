'use strict';

/* :construction: Under Construction :construction: */

const { Ndarray, math, core } = require('vecto');


module.exports = class Optimizer {
    constructor(network, len) {
        this.paramLen = len;
        this.feedForward = network.feedForward;
        this.layers = network.layers;
        this.costFn = network.costFn;
        this.features = network.features;
        this.batch_size = this.features.length;
        this.labels = network.labels;
        this.variablesList = [];
    }

    /** backpropagation : Calculates the error in activation of every layer 
     * 
     * @activations : [Number] , The activation of the output layer
     * 
     * @labels      : [Number] , The labels(desired output) for given input
     * 
     * @activ_      : [Number] , The g'(z) for current batch
     * 
     * Returns      : [[Number],[Number]], delw is an array of Ndarrays having error in weights
     *                of every layer and delb is array of Ndarrays having errors in biases
     */

    backprop(labels) {
        let dw = [],
            db = [],
            delta = [];
        for (let i = 1; i < this.layers.length; i++) {
            dw.push(Ndarray.zeroes(this.layers[i].weights.shape));
            db.push(Ndarray.zeroes(this.layers[i].biases.shape));
        }

        let cost = this.costFn(this.layers[this.layers.length - 1].activation.array, labels, this.batch_size);
        let gradc = this.costFn.grad(this.layers[this.layers.length - 1].activation.array, labels, this.batch_size),
            activ_dash = this.layers[this.layers.length - 1].activ_;

        delta[(this.layers.length - 1)] = math.product(gradc, activ_dash, 'dot');

        for (let i = this.layers.length - 2; i > 0; i--) {
            delta[i] = math.product(math.product(this.layers[i + 1].weights.transpose(), delta[i + 1]), this.layers[i].activ_, 'dot');
        }

        for (let i = 1; i < this.layers.length; i++) {
            dw[i - 1].arrange(math.sum(dw[i - 1].array, math.product(delta[i], this.layers[i - 1].activation.transpose())));
            /* Confusion with the delta shape */
            db[i - 1].arrange(math.sum(db[i - 1].array, delta[i]));
        }
        this.dw = dw;
        this.db = db;
        return [dw, db];
    }

    /* Produces The Parameter Arrays For Updation */
    initParams() {
        for (let i = 0; i < this.paramLen / 2; i++) {
            let paramw = [];
            let paramb = [];
            for (let l = 1; l < this.layers.length; l++) {
                paramw.push(Ndarray.zeroes(this.layers[l].weights.shape));
                paramb.push(Ndarray.zeroes(this.layers[l].biases.shape));
            }
            this.variablesList.push(paramw)
            this.variablesList.push(paramb);
        }
    }

    /* Performs Forward And Backward Propagation And Returns The Gradients */

    Props(batch_x, batch_y) {
        this.feedForward(batch_x);
        return this.backprop(batch_y);
    }

    /* Form Mini Batches Of Size m */

    formBatches(m) {
        this.batch_size = m;
        const { shuffle } = require('../net_util');
        return shuffle(this.features, this.labels, m);
    }

    /* Updates The Params Of The Network */

    updateProcess(beta1, beta2) {
        let [vdw, vdb, sdw, sdb] = this.variablesList;

        for (let i = 1; i < this.layers.length; i++) {
            vdw[i].arrange(math.sum(math.product(beta1, vdw[i].array), math.product((1 - beta1), this.dw[i].array)));
            vdb[i].arrange(math.sum(math.product(beta1, vdb[i].array), math.product((1 - beta1), this.db[i].array)));
            if (sdw && sdb) {
                sdw[i].arrange(math.sum(math.product(beta2, sdw[i].array), math.sum((1 - beta2), math.pow(this.dw[i].array, 2))));
                sdb[i].arrange(math.sum(math.product(beta2, sdb[i].array), math.sum((1 - beta2), math.pow(this.db[i].array, 2))));
            }
        }
    }
}