/**
 * JBrain : A neural network implementation in Javascript.
 * Project Name : JBrain
 * Project Code Name : Jason
 * Author : abtExp<abt.exp@gmail.com>
 * 
 */

/***********************************************************
 *                  Under Construction                     *
 *                 \[----------------]/                    *         
 ***********************************************************/

const { core } = require('vecto');
const {
    getCostFn,
    getOptimizer,
    formNet,
    calcLayerShape
} = require('../util/net_util');
const Model = require('./Model');

/**
 * @class Network -  The Network class for generating a network
 *
 */
class Network extends Model {
    /** 
     * @constructor : Creating The Network
     * 
     * @param {object|Array} net_config - the layerwise configuration of the neural network
     * 
     * @param {string} lyr_type - defines the activation function for hidden layers if @net_config is array
     * 
     * @param {string} op_type - defines the activation function for output layer if @net_config is array
     * 
     * @returns {NetworkObject}
     * 
     */
    constructor(net_config, lyr_type = 'sigmoid', op_type = 'sigmoid') {
        super('Network');
        this.layers = [];
        if (net_config)
            formNet(this, net_config, lyr_type, op_type);
    }

    /**
     * @method add -  Adds a layer to the end of the current network config
     * 
     * @param {Layer} layer - The Layer to be added. 
     * 
     */
    add(layer) {
        layer.input = layer.input || this.layers[this.layers.length - 1];
        layer.shape = calcLayerShape(layer.shape, layer.input.activation.shape);
        this.layers.push(layer);
    }

    /**
     * @method compile - Compiles the model, i.e., assigns the optimizer and cost and metric
     * 
     * @param {String|Object} optimizer - A String or an object defining the optimizer
     * 
     * @param {String} cost - A String defining the cost function to be used
     * 
     * @param {String|Array} metric - A String for a single value eval metric or an array of metrics to eval on
     * 
     */
    compile({
        cost = 'crossEntropy',
        optimizer: { name = 'adam', beta1 = 0.9, beta2 = 0.99, eps = 1e-8 },
        metric = 'accuracy'
    } = {}) {
        this.cost = getCostFn(cost);
        let opt = getOptimizer(optimizer.name);
        this.optimizer = new opt(this);
    }

    /** 
     * 
     * @method fit : Fit the Network (i.e., train) 
     * 
     * @param {Object} opt - The options object
     * 
     * @param {Array} opt.train_features - features for the network to learn. The shape for @train_features could
     *                                 be either [#examples,#features] or [#features, #examples] 
     *
     * 
     * @param {Array} opt.train_labels - labels for the training set. The shape for @train_labels could
     *                               be either [#examples,#outputNeurons] or [#outputNeurons, #examples] 
     * 
     * @param {float} opt.neta - the learning rate
     * 
     * @param {int} opt.epoch - Number of epochs
     *  
     * @param {boolean} opt.evaluate - whether to evaluate the learning of the network
     * 
     * @param {int} opt.eval_epoch - epochs after which to evaluate the learning
     * 
     * @param {boolean} opt.validate - whether validation data will be provided
     * 
     * @param {Array} opt.validate_dat - validation features to learn better, @validate must be true
     * 
     * @param {boolean} opt.norm - Whether to perform batch norm or not.
     * 
     */
    fit({
        train_features,
        train_labels,
        neta = 0.5,
        epoch = 100,
        m = 10,
        evaluate = true,
        eval_epoch = 10,
        validate = false,
        validate_dat = null,
        norm = true,
    } = {}) {
        this.features = core.calcShape(train_features)[0] !== this.layers[0].shape[0] ?
            core.transpose(train_features, 'float32') : train_features;

        this.labels = core.calcShape(train_labels)[0] !== this.layers[this.layers.length - 1].activation.shape[0] ?
            core.transpose(train_labels) : train_labels;

        this.optimizer.optimize(neta, epoch, m, optimizer);
    }

    /** 
     * @method feedForward - Calculates the activation of each layer.
     *
     * @param {Array} input - the input to the input layer
     *   
     */
    feedForward(input) {
        this.layers[0].activation.resize(core.calcShape(input));
        this.layers[0].activation.arrange(input);
        for (let i = 1; i < this.layers.length; i++) {
            this.layers[i].fire();
        }
    }

    /**
     * @method eval : evaluates the learning of network by comparing the metric
     */
    eval() {
        let cost = this.cost(this.labels, this.activations);
    }

    /** 
     * @method predict - Predicts the output for the given input features
     * 
     * @param {Array} input - The features for which the prediction is 
     *                        to be made.
     * 
     * @returns {Array} - The activation of the output layer.                       
     * 
     */
    predict(input) {
        return this.feedForward(input)[0][this.layers.length - 1];
    }

}

module.exports = Network;