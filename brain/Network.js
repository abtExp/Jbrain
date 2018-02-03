/**
 * JBrain : A neural network implementation in Javascript.
 * Project Name : JBrain
 * Project Code Name : Jason
 * Author : Anubhav Tiwari <atworkstudios@gmail.com>
 * 
 */

// Currently it's very slow, have to make it faster.

const { core } = require('vecto'),
    cost = require('../util/cost'),
    optimizer = require('../util/optimizer'), { InputLayer, ConnectedLayer } = require('../util/layers'),
    Model = require('./Model'), { cost_grad, shuffle } = require('../util/net_util');


/**
 * define a network with net_config representing each layer with the configuration object
 * of the layer : net_config is an array of objects, the length of the array determines the 
 * number of layers and each ith element of net_config defines the configuration of the ith 
 * layer.
 */

/**
 * @class Network -  The Network class for generating a neural network
 *
 */

class Network extends Model {
    /** 
     * constructor : Creating The Network
     * 
     * @param {object/Array} net_config - the layerwise configuration of the neural network
     * 
     * @param {string} lyr_type - defines the activation function for hidden layers if @net_config is array
     * 
     * @param {string} op_type - defines the activation function for output layer if @net_config is array
     * 
     * @returns {NetworkObject}
     * 
     */

    constructor(net_config, lyr_type = 'sigmoid', op_type = 'sigmoid') {
        super('Network', net_config);
        this.net_config = net_config;
        this.layers = [];
        if (typeof net_config[0] === 'object') {
            this.layers.push(net_config[0]);
            for (let i = 1; i < this.net_config.length; i++) {
                net_config[i].input = net_config[i].input || this.layers[this.layers.length - 1];
                this.layers.push(net_config[i]);
            }
        } else {
            this.layers.push(new InputLayer({ shape: [net_config[0], null], name: `input${this.layers.length}` }));
            for (let i = 1; i < this.net_config.length - 1; i++) {
                this.layers.push(new ConnectedLayer({
                    shape: [this.net_config[i], this.net_config[i - 1]],
                    activationFunction: lyr_type,
                    input: this.layers[this.layers.length - 1],
                    name: `fc${this.layers.length}`
                }));
            }
            this.layers.push(new ConnectedLayer({
                shape: [this.net_config[this.net_config.length - 1],
                    this.net_config[this.net_config.length - 2]
                ],
                activationFunction: op_type,
                input: this.layers[this.layers.length - 1],
                name: `output${this.layers.length}`
            }))
        }
        super.config = this.layers;
    }

    /** 
     * 
     * fit : Fit the Network (i.e., train) 
     * 
     * @param {Array} train_features - features for the network to learn. The shape for @train_features could
     *                                 be either [#examples,#features] or [#features, #examples] 
     *
     * 
     * @param {Array} train_labels - labels for the training set. The shape for @train_labels could
     *                               be either [#examples,#outputNeurons] or [#outputNeurons, #examples] 
     * 
     * @param {float} neta - the learning rate
     * 
     * @param {int} epoch - Number of epochs
     * 
     * @param {string} costFn - The cost function to be used for optimisation
     *                          available values : 'crossEntropy','quadCost','categoricalCrossEntropy'
     * 
     * @param {boolean} evaluate - whether to evaluate the learning of the network
     * 
     * @param {int} eval_epoch - epochs after which to evaluate the learning
     * 
     * @param {boolean} validate - whether validation data will be provided
     * 
     * @param {Array} validate_dat - validation features to learn better, @validate must be true
     * 
     * @param {object/string} optimizer - the optimizer for training.
     * 
     * properties of the optimizer if @optimizer is object  
     *                                    name {string} : The name of the optimizer to use
     *                                    available values : 'adam','rmsprop','gd','sgd','mbgd'
     * 
     *                                    beta/1/2 {float} : The optimization parameter beta(for sgd,mbgd,gd and rmsprop)
     *                                                       beta1 and beta2 for adam 
     *                                    epsilon {float} :  The optimization parameter
     * 
     * 
     */


    fit({
        train_features,
        train_labels,
        neta = 0.5,
        epoch = 100,
        m = 10,
        costFn = 'crossEntropy',
        // evaluate = true,
        // eval_epoch = 10,
        // validate = false,
        // validate_dat = null,
        optimizer = {
            name: 'adam',
            beta1: 0.9,
            beta2: 0.999,
            epsilon: 1e-6,
        }
    }) {
        this.features = core.calcShape(train_features)[0] !== this.layers[0].shape[0] ?
            core.transpose(train_features, 'float32') : train_features;

        this.labels = core.calcShape(train_labels)[0] !== this.layers[this.layers.length - 1].activation.shape[0] ?
            core.transpose(train_labels) : train_labels;
        this.costFn = getCostFn(costFn);
        // this.validate_dat = validate_dat || null;
        let opt = getOptimizer(optimizer.name);
        this.optimizer = new opt(this);
        this.optimizer.optimize(neta, epoch, m, optimizer);
        // if (validate && validate_dat) {
        //     this.validate(validate_dat);
        // }
    }

    /** 
     * feed_forward : Calculates the activation of each layer.
     *
     * @param {Array} input - the input to the input layer
     * 
     * @return {Array} - An array containing Activations of each layer
     *                   and also the weighted inputs for each layer.  
     * 
     */

    feedForward(input) {
        this.layers[0].activation.resize(core.calcShape(input));
        this.layers[0].activation.arrange(input);
        for (let i = 1; i < this.layers.length; i++) {
            this.layers[i].fire();
        }
    }


    /* eval : evaluates the learning of network by comparing the accuracy */
    eval() {
        let cost = this.costFn(this.labels, this.activations);
    }

    /** predict : Predicts the output for the given test feature
     * 
     * @param {Array} test_features - The features for which the prediction is 
     *                                to be made.
     * 
     * @returns {Array} - The activation of the output layer.                       
     * 
     */
    predict(test_features) {
        return this.feedForward(test_features)[0][this.layers.length - 1];
    }

}

/** getOptimizer : Returns the Optimizer Class to optimize the params
 * 
 * @param {string} optName - The name of the optimizer   
 *
 * @returns { OptimizerClassObject }
 * 
 */

function getOptimizer(optName) {
    const optimizer = require('../util/optimizer');
    console.log(optimizer);
    if (optName === 'adam') return optimizer.AdamOptimizer
    else if (optName === 'rmsprop') return optimizer.RMSPropOptimizer;
    else if (optName === 'gd' || optName === 'sgd' || optName === 'mbgd') return optimizer.GradientDescentOptimizer;
}

/** getCostFn : Returns the cost function for the given name
 *  
 * @param {string} name -  The cost function to be used for optimisation of weights and biases ( learning )
 *                         available values : 'crossEntropy','quadCost','categoricalCrossEntropy'
 * @returns {CostFunction}
 * 
 */

function getCostFn(name) {
    if (name === 'crossEntropy') return cost.cross_entropy;
    else if (name === 'logLike') return cost.log_like;
    else if (name === 'quadCost') return cost.quadCost;
    else throw new Error('Undefined Cost Function');
}

module.exports = Network;