const { math, core } = require('vecto');
const { InputLayer, ConnectedLayer } = require('./layers');

/**
 * @function weighted_input - Caculates the linear activation
 * 
 * @param {Array|Ndarray} w - Weights
 * @param {Array|Ndarray} x - Input
 * @param {Array|Ndarray} b - Biases
 * 
 * @returns {Array} - The linear activation
 * 
 */
function weighted_input(w, x, b) {
    return math.sum(math.product(w, x, 'matrix'), b);
}

/** 
 * @function shuffle - Shuffles the features and labels keeping them aligned and forms mini batches
 * 
 * @param {Array|Ndarray} input - The features array
 * 
 * @param {Array|Ndarray} labels - The labels array
 * 
 * @param {int} mini_batch_size : int , The size of a minibatch
 * 
 * @returns {Array} - The array of minibatches formed with the shuffled data
 * 
 */

function shuffle(input, labels, mini_batch_size) {
    let batches = [],
        batch = [],
        y = [],
        y_ = [],
        no_of_batches = Math.floor(input.length / mini_batch_size),
        i, j;
    for (i = 0; i < no_of_batches; i++) {
        while (batch.length < mini_batch_size) {
            j = Math.floor(Math.random() * input.length);
            batch.push(input[j]);
            y.push(labels[j]);
        }
        batches.push(batch);
        y_.push(y);
        batch = [];
        y = [];
    }
    return [batches, y_];
}

function pooling(arr, type = 'max') {

}

/** 
 * @function getOptimizer - Returns the Optimizer Class to optimize the params
 * 
 * @param {string} optName - The name of the optimizer   
 *
 * @returns { OptimizerClassObject } - The Optimizer object
 * 
 */

function getOptimizer(optName) {
    const optimizer = require('../util/optimizer');
    if (optName === 'adam')
        return optimizer.AdamOptimizer
    else if (optName === 'rmsprop')
        return optimizer.RMSPropOptimizer;
    else if (optName === 'gd' || optName === 'sgd' || optName === 'mbgd')
        return optimizer.GradientDescentOptimizer;
}

/** getCostFn : Returns the cost function for the given name
 *  
 * @param {string} name -  The cost function to be used for optimisation of weights and biases ( learning )
 *                         available values : 'crossEntropy','quadCost','categoricalCrossEntropy'
 * @returns {CostFunction} - The Cost Function
 * 
 */

function getCostFn(name) {
    if (name === 'crossEntropy') return cost.crossEntropy;
    else if (name === 'logLike') return cost.categoricalCrossEntropy;
    else if (name === 'quadCost') return cost.quadCost;
    else throw new Error('Cost Function not available');
}


/**
 * @function formNet - Forms The Network for given config
 * 
 * @param {Network} network - The Network
 * @param {Array} net_config - The configuration
 * @param {String} lyr_type - The activation function for hidden layers
 * @param {String} op_type - The activation function for output layer
 * 
 */
function formNet(network, net_config, lyr_type, op_type) {
    if (typeof net_config[0] === 'object') {
        network.layers.push(net_config[0]);
        for (let i = 1; i < net_config.length; i++) {
            net_config[i].input = net_config[i].input || network.layers[network.layers.length - 1];
            network.layers.push(net_config[i]);
        }
    } else {
        network.layers.push(new InputLayer({ shape: [net_config[0], null], name: `input${network.layers.length}` }));
        for (let i = 1; i < net_config.length - 1; i++) {
            network.layers.push(new ConnectedLayer({
                shape: [
                    net_config[i],
                    net_config[i - 1]
                ],
                activationFunction: lyr_type,
                input: network.layers[network.layers.length - 1],
                name: `fc${network.layers.length}`
            }));
        }
        network.layers.push(new ConnectedLayer({
            shape: [
                net_config[net_config.length - 1],
                net_config[net_config.length - 2]
            ],
            activationFunction: op_type,
            input: network.layers[network.layers.length - 1],
            name: `output${network.layers.length}`
        }))
    }
}

/**
 * @function calcLayerShape - Returns the shape of the layer
 * 
 * @param {Array} layerShape - The Shape of layer (if given)
 * 
 * @param {Array} inputShape - The Shape of input layer's activation
 * 
 * @returns {Array} - The shape of the layer
 * 
 */
function calcLayerShape(layerShape, inputShape) {
    /* Description of the task goes here, adjust the '*' ************
     *      _______   _____           _____     _____    ************
     ****  |#######| /#####\          |####\   /#####\   ************
     ****     |#|   |#|   |#|  _____  |#| |#| |#|   |#|  ************
     ****     |#|   |#|   |#| |_____| |#|_|#| |#|   |#|  ************
     ****     |#|    \#####/          |####/   \#####/   ************
     ***************************************************************/
}

module.exports = {
    calcLayerShape,
    formNet,
    getCostFn,
    getOptimizer,
    shuffle,
    weighted_input
}