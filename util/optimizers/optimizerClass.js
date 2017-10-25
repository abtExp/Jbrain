'use strict';

/* :construction: Under Construction :construction: */

module.exports = class Optimizer {
    constructor(network) {
        this.feedForward = network.feedForward;
        this.layers = network.layers;
        this.costFn = network.constFn;
        this.lyrsCount = network.lyrs_count;
        this.features = network.features;
        this.labels = network.labels;
        this.variablesList = {};
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
        const { Ndarray, math } = require('vecto');
        let dw = [],
            db = [],
            delta = [];
        for (let i = 1; i < this.layers.length; i++) {
            dw.push(Ndarray.zeroes(this.layers[i].weights.shape));
            db.push(Ndarray.zeroes(this.layers[i].biases.shape));
        }

        let gradc = this.costFn.grad(labels[this.layers.length - 1], this.layers[this.layers.length - 1].activation),
            activ_dash = this.layers[this.layers.length - 1].activ_;

        delta[(this.layers.length - 1)] = math.product(gradc, activ_dash, 'dot');

        for (let i = this.layers.length - 2; i > 0; i--) {
            delta[i] = math.product(math.product(delta[i + 1],
                this.layers[i + 1].weights.transpose()), this.layers[i].activ_, 'dot');
        }

        for (let i = 1; i < this.layers.length; i++) {
            dw[i].arrange(math.sum(dw[i].array, math.product(delta[i], this.layers[i - 1].activation)));
            db[i].arrange(math.sum(db[i].array, delta[i]));
        }
        this.dw = dw;
        this.db = db;
        return [dw, db];
    }

    /* Produces The Parameter Arrays For Updation */

    preProcecss(opt) {
        const { Ndarray } = require('vecto');
        let vdw = [],
            vdb = [],
            sdw, sdb;
        for (let i = 1; i < this.layers.length; i++) {
            vdw.push(Ndarray.zeroes(this.layers[i].weights.shape));
            vdb.push(Ndarray.zeroes(this.layers[i].biases.shape));
        }
        this.variablesList.vdw = vdw;
        this.variablesList.vdb = vdb;

        if (opt === 'rmsprop' || opt === 'adam') {
            sdw = [];
            sdb = [];
            for (let i = 1; i < this.layers.length; i++) {
                sdw.push(Ndarray.zeroes(this.layers[i].weights.shape));
                sdb.push(Ndarray.zeroes(this.layers[i].biases.shape));
            }
            this.variablesList.sdw = sdw;
            this.variablesList.sdb = sdb;
        }
    }

    /* Performs Forward And Backward Propagation And Returns The Gradients */

    Props(batch_x, batch_y) {
        this.feedForward(batch_x);
        return this.backprop(batch_y);
    }

    /* Form Mini Batches Of Size m */

    formBatches(m) {
        const { shuffle } = require('../net_util');
        let batches_x, btaches_y;
        return shuffle(this.features, this.labels, m);
    }

    /* Updates The Weights And Biases Of The Network */

    updateProcess(beta1, beta2) {
        /* The Generic Code For Updation Of Both The Parameters Of The Network As Well As The 
         * Update Parameters (vdw,vdb,sdw,sdb,vdwcorr,vdbcorr,sdwcorr,sdbcorr)
         * Makes more sense to keep just the vdw,vdb,sdw and sdb as the corr versions can be calculated
         * later at the time of the update.
         */

        const { math } = require('vecto');

        let { vdw, vdb } = this.variablesList;
        if (this.variablesList.sdw && this.variablesList.sdb) {
            let { sdw, sdb } = this.variablesList;
        }

        for (let i = 1; i < this.layers.length; i++) {
            vdw[i].arrange(math.sum(math.product(beta1, vdw[i].array), math.product((1 - beta1), this.dw[i].array)));
            vdb[i].arrange(math.sum(math.product(beta1, vdb[i].array), math.product((1 - beta1), this.db[i].array)));
            if (sdw && sdb) {
                sdw[i].arrange(math.sum(math.product(beta2, sdw[i].array), math.sum((1 - beta2), math.pow(this.dw[i].array, 2))));
                sdb[i].arrange(math.sum(math.product(beta2, sdb[i].array), math.sum((1 - beta2), math.pow(this.db[i].array, 2))));
            }
        }
        this.variablesList.vdw = vdw;
        this.variablesList.vdb = vdb;
        if (sdw && sdb) {
            this.variableList.sdw = sdw;
            this.variableList.sdb = sdb;
        }
    }
}