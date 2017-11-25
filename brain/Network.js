/* JBrain : A neural network implementation in Javascript.
 * Project Name : JBrain
 * Project Code Name : Jason
 * Author : Anubhav Tiwari <atworkstudios@gmail.com>
 */

const { core } = require('../node_modules/vecto'), { cost_grad, shuffle } = require('../util/net_util'),
    cost = require('../util/cost'),
    Layer = require('../util/layers'),
    optimizer = require('../util/optimizer');


/* define a network with net_config representing each layer with the configuration object
 * of the layer : net_config is an array of objects, the length of the array determines the 
 * number of layers and each ith element of net_config defines the configuration of the ith 
 * layer.
 */

class Network {
    /** constructor : Creating The Network
     * 
     * @net_config : [{Object}]/[int], ( the layer wise representation of the network)
     * 
     * Returns : { NetworkObject }
     * 
     */

    constructor(net_config, lyr_type = 'relu', op_type = 'softmax') {
        this.net_config = net_config;
        this.lyrs_count = net_config.length;
        this.layers = [];
        this.activations = [];

        if (this.net_config[0].constructor.name === 'Object') {
            this.layers.push(new Layer(net_config[0]));
            for (let i = 1; i < net_config.length; i++) {
                if (net_config[i].number) {
                    if (net_config[i].config) {
                        for (let j = 0; j < net_config[i].number; j++) {
                            net_config[i].config[j].input = net_config[i].config[j].input ||
                                this.layers[this.layers.length - 1];
                            net_config[i].config[j].type = net_config[i].type;
                            this.layers.push(new Layer(net_config[i].config[j]));
                        }
                    } else {
                        console.error('Please Provide The Configuration For Each Layer');
                    }
                } else {
                    net_config[i].input = net_config[i].input ||
                        this.layers[this.layers.length - 1];
                    this.layers.push(new Layer(net_config[i]));
                }
            }
        } else {
            this.layers.push(new Layer({ type: 'input', shape: [net_config[0], null] }));
            for (let i = 1; i < this.net_config.length - 1; i++) {
                this.layers.push(new Layer([this.net_config[i], this.net_config[i - 1]], lyr_type, this.layers[this.layers.length - 1]));
            }
            this.layers.push(new Layer([this.net_config[this.lyrs_count - 1], this.net_config[this.lyrs_count - 2]], op_type, this.layers[this.layers.length - 1]))
        }
    }

    /** fit : Fit the Network (i.e., train) 
     * 
     * @train_features : [Number], of features for the network to learn on
     * 
     * @train_labels : [Number], of desired results
     * 
     * @neta : fl.oat , the learning rate
     * 
     * @epoch : int , Number of learning cycles over which the optimisation takes place
     * 
     * @costFn : 'String', The cost function to be used for optimisation of weights and biases ( learning )
     *             available values : 'cross_entropy','quadCost','logLike'
     * 
     * @evaluate : !Boolean!, whether to evaluate the learning of the network
     * 
     * @eval_epoch : int , of epochs(learning cycles) after which to evaluate the learning
     * 
     * @validate : !Boolean!, whether validation data will be provided for better learning
     * 
     * @validate_dat : [Number], of validation features to learn better, @validate must be true
     * 
     * @validate_epochs : int , Number of epochs after which to evaluate the performance on validation data
     * 
     * @optimizer : {Object} : props : @name : 'String' , The name of the optimizer to use
     *                                          available values : 'adam','rmsprop','gd','sgd','mbgd'
     * 
     *                                 @beta/1/2 : fl.oat , The optimization parameter beta(for sgd,mbgd,gd and rmsprop)
     *                                                      beta1 and beta2 for adam 
     *                                 @epsilon : fl.oat , The optimization parameter
     * 
     * Returns : Nothing, Just optimises the neurons's weights and biases.
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
        // validate_epochs,
        optimizer = {
            name: 'adam',
            beta1: 0.9,
            beta2: 0.999,
            epsilon: 1e-6,
        }
    }) {
        this.features = train_features;
        this.labels = core.calc_shape(train_labels)[0] !== this.layers[this.layers.length - 1].activation.shape[0] ?
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

    /** feed_forward : Calculates the activation of each layer.
     *
     * @input : [Number] , the input to the input layer
     * 
     * Returns : [[Number],[Number]] ,  An array containing Activations of each layer
     *           and also the weighted inputs for each layer.  
     * 
     */

    feedForward(input) {
        if (core.calc_shape(input)[0] !== this.layers[0].shape[0]) input = core.transpose(input, 'float32');
        this.layers[0].activation.resize(core.calc_shape(input));
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
     * @test_features : [Number] , The features for which the prediction is 
     *                  to be made.
     * 
     * Returns : [Number] , The activation of the output layer.                       
     * 
     */
    predict(test_features) {
        return this.feedForward(test_features)[0][this.lyrs_count - 1];
    }

    formNet(layers) {
        // synthesise net from layers.
    }
}

/** getOptimizer : Returns the Optimizer Class to optimize the params
 * 
 * @optName : 'String' , the name of the optimizer   
 *
 * Returns : { OptimizerClassObject }
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
 * @name : 'String', The cost function to be used for optimisation of weights and biases ( learning )
 *          available values : 'cross_entropy','quadCost','logLike'
 *  
 */

function getCostFn(name) {
    if (name === 'crossEntropy') return cost.cross_entropy;
    else if (name === 'logLike') return cost.log_like;
    else if (name === 'quadCost') return cost.quadCost;
    else throw new Error('Undefined Cost Function');
}




module.exports = Network;