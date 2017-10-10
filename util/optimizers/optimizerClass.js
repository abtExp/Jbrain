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
        this.variablesList = [];
    }

    /* backpropagation : Calculates the error in activation of every layer 
     * @activations : [array] , The activation of the output layer
     * @labels      : [array] , The labels(desired output) for given input
     * @activ_      : [array] , The g'(z) for current batch
     * Returns      : [delw,delb], delw is an array of ndarrays having error in weights
     *                of every layer and delb is array of ndarrays having errors in biases
     */

    backprop(activations, labels, activ_) {
        const { ndarray, math } = require('vecto');
        let dw = [],
            db = [],
            delta = [];
        for (let i = o; i < this.layers.length; i++) {
            dw.push(ndarray.zeroes(this.layers[i].weights.shape));
            db.push(ndarray.zeroes(this.layers[i].biases.shape));
        }

        let gradc = this.costFn.grad(labels[this.layers.length - 1], activations[this.layers.length - 1]),
            activ_dash = activ_[this.layers.length - 1];

        delta[(this.layers.length - 1)] = math.product(gradc, activ_dash, 'dot');

        for (let i = this.layers.length - 2; i >= 0; i--) {
            delta[i] = math.product(math.product(delta[i + 1],
                this.layers[i + 1].weights.transpose()), this.layers[i].activ_, 'dot');
        }

        for (let i = 0; i < this.layers.length; i++) {
            dw[i].arrange(math.sum(dw[i].array, math.product(delta[i], activations[i])));
            db[i].arrange(math.sum(db[i].array, delta[i]));
        }
        return [dw, db];
    }

    /* Produces The Parameter Arrays For Updation */

    preProcecss(opt) {
        const { ndarray } = require('vecto');
        let vdw = [],
            vdb = [],
            sdw, sdb, vdwcorr, vdbcorr, sdwcorr, sdbcorr;
        for (let i = 0; i < this.layers.length; i++) {
            vdw.push(ndarray.zeroes(this.layers[i].weights.shape));
            vdb.push(ndarray.zeroes(this.layers[i].biases.shape));
        }
        this.variablesList.push({ 'vdw': vdw });
        this.variablesList.push({ 'vdb': vdb });

        if (opt === 'rmsprop') {
            sdw = [];
            sdb = [];
            for (let i = 0; i < this.layers.length; i++) {
                sdw.push(ndarray.zeroes(this.layers[i].weights.shape));
                sdb.push(ndarray.zeroes(this.layers[i].biases.shape));
            }
            this.variablesList.push({ 'sdw': sdw });
            this.variablesList.push({ 'sdb': sdb });
        }
        if (opt === 'adam') {
            sdw = [];
            sdb = [];
            sdwcorr = [];
            sdbcorr = [];
            vdwcorr = [];
            vdbcorr = [];
            for (let i = 0; i < this.layers.length; i++) {
                sdw.push(ndarray.zeroes(this.layers[i].weights.shape));
                sdb.push(ndarray.zeroes(this.layers[i].biases.shape));
                vdwcorr.push(ndarray.zeroes(this.layers[i].weights.shape));
                vdbcorr.push(ndarray.zeroes(this.layers[i].biases.shape));
                sdwcorr.push(ndarray.zeroes(this.layers[i].weights.shape));
                sdbcorr.push(ndarray.zeroes(this.layers[i].biases.shape));
            }
            this.variablesList.push({ 'sdw': sdw });
            this.variablesList.push({ 'sdb': sdb });
            this.variablesList.push({ 'vdwcorr': vdwcorr });
            this.variablesList.push({ 'vdbcorr': vdbcorr });
            this.variablesList.push({ 'sdwcorr': sdwcorr });
            this.variablesList.push({ 'sdbcorr': sdbcorr });
        }
    }

    /* Performs Forward And Backward Propagation And Returns The Gradients */

    Props(batch_x, batch_y) {
        let activations = [],
            z = [],
            dw = [],
            db = [],
            activ_ = [];
        [activations, z, activ_] = this.feedForward(batch_x);
        return this.backprop(activations, batch_y, activ_);
    }

    /* Form Mini Batches Of Size m */

    formBatches(m) {
        const { shuffle } = require('../net_util');
        let batches_x, btaches_y;
        return shuffle(this.features, this.labels, m);
    }

    /* Updates The Weights And Biases Of The Network */

    updateProcess() {
        /* The Generic Code For Updation Of Both The Parameters Of The Network As Well As The 
         * Update Parameters (vdw,vdb,sdw,sdb,vdwcorr,vdbcorr,sdwcorr,sdbcorr)
         */

    }

}