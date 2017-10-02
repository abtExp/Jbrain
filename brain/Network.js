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
    /* Constructor
     * 
     * @net_config : [{Objects}]/[numbers], ( the layer wise representation of the network)
     */

    constructor(net_config, lyr_type = 'relu', op_type = 'softmax') {
        this.net_config = net_config;
        this.lyrs_count = net_config.length;
        this.layers = [];
        this.weights = [];
        this.biases = [];

        if (this.net_config[0].constructor.name === 'Object') {
            for (let i = 0; i < net_config.length; i++) {
                if (net_config[i].number) {
                    if (net_config[i].config) {
                        for (let j = 0; j < net_config[i].number; j++) {
                            this.layers.push(new Layer(net_config[i].config[j]));
                        }
                    } else {
                        console.error('Please Provide The Configurration For Each Layer');
                    }
                } else {
                    this.layers.push(new Layer(net_config[i]));
                }
            }
        } else {
            for (let i = 1; i < this.net_config.length - 1; i++) {
                this.layers.push(new Layer([this.net_config[i], this.net_config[i - 1]], lyr_type));
            }
            this.layers.push(new Layer([this.net_config[this.lyrs_count - 1], this.net_config[this.lyrs_count - 2]], op_type))
        }
    }

    /* Fit the Network (i.e., train) 
     * @train_features : [array], of features for the network to learn on
     * @train_labels : [array], of desired results
     * @neta : fl.oat value, the learning rate
     * @epoch : int , Number of learning cycles over which the optimisation takes place
     * @cost_fn : 'String', The cost function to be used for optimisation of weights and biases ( learning )
     * @evaluate : !Boolean!, whether to evaluate the learning of the network
     * @eval_epoch : int , of epochs(learning cycles) after which to evaluate the learning
     * @validate : !Boolean!, whether validation data will be provided for better learning
     * @validate_dat : [array], of validation features to learn better, @validate must be true
     *
     * Returns : Nothing, Just optimises the neurons's weights and biases.
     */

    fit({
        train_features,
        train_labels,
        neta = 0.5,
        epoch = 100,
        m = 10,
        costFn = 'crossEntropy',
        evaluate = true,
        eval_epoch = 10,
        validate = false,
        validate_dat = null,
        validate_epochs,
        optimizer = {
            name: 'adam',
            beta1: 0.9,
            beta2: 0.999,
            epsilon: 1e-4,
        }
    }) {
        /* A Bit Of Confusion On How I Want To Do This */
        this.features = train_features;
        this.labels = train_labels;
        this.costFn = getCostFn(costFn);
        // this.validate_dat = validate_dat || null;
        let opt = getOptimizer(optimizer.name);
        console.log(opt);
        this.optimizer = new opt(this);
        this.optimizer.optimize(neta, epoch, m, optimizer);
        if (validate && validate_dat) {
            this.validate(validate_dat);
        }
        // this.optimizer.optimize(this, neta, epoch, m, optimizer);
    }

    /* feed_forward : Calculates the activation of each layer.
     * @input : [array] , the input to the input layer
     * Returns : [a,z] ,  An array containing Activations of each layer
     *           and also the weighted inputs for each layer.  
     */

    feedForward(input) {
        let activ = [],
            z = [],
            activ_ = [];

        activ.push(core.transpose(input));
        for (let i = 0; i < this.layers.length; i++) {
            let res = this.layers[i].fire(activ[i]);
            activ.push(core.transpose(res[0], 'float32'));
            z.push(res[1]);
            activ_.push(this.layers[i].activ_dash(z[i]));
        }
        return [activ, z, activ_];
    }


    /* eval : evaluates the learning of network by comparing the accuracy */
    eval() {
        let cost = this.costFn(this.labels, this.activations);
    }

    /* predict : Predicts the output for the given test feature 
     * @test_features : [array] , The features for which the prediction is 
     *                  to be made.
     * Returns : [array] , The activation of the output layer.                       
     */
    predict(test_features) {
        return this.feedForward(test_features)[0][this.lyrs_count - 1];
    }
}

function getOptimizer(optName) {
    const optimizer = require('../util/optimizer');
    if (optName === 'adam') return optimizer.AdamOptimizer
    else if (optName === 'rmsprop') return optimizer.RMSPropOptimizer;
    else if (optName === 'gd' || optName === 'sgd' || optName === 'mbgd') return optimizer.GradientDescent;
}

function getCostFn(name) {
    if (name === 'crossEntropy') return cost.cross_entropy;
    else if (name === 'logLike') return cost.log_like;
    else if (name === 'quadCost') return cost.quadCost;
    else throw new Error('Undefined Cost Function');
}




module.exports = Network;