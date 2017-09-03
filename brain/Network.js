/* JBrain : A neural network implementation in Javascript.
 * Project Name : JBrain
 * Project Code Name : Jason
 * Author : Anubhav Tiwari <atworkstudios@gmail.com>
 */

const { ndarray, math, core } = require('../node_modules/vecto'), { cost_grad, shuffle } = require('../util/net_util'),
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
     * @net_config : [array ( Objects )], ( the layer wise representation of the network)
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
                            this.weights.push(this.layers[i].weights);
                            this.biases.push(this.layers[i].biases);
                        }
                    } else {
                        console.error('Please Provide The Configurration For Each Layer');
                    }
                } else {
                    this.layers.push(new Layer(net_config[i]));
                    this.weights.push(this.layers[i].weights);
                    this.biases.push(this.layers[i].biases);
                }
            }
        } else {
            for (let i = 1; i < this.net_config.length - 1; i++) {
                this.layers.push(new Layer([this.net_config[i], this.net_config[i - 1]], lyr_type));
                this.weights.push(this.layers[i].weights);
                this.biases.push(this.layers[i].biases);
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
        epoch = 10000,
        m = 1024,
        cost_fn = 'logLike',
        evaluate = true,
        eval_epoch,
        validate = false,
        validate_dat,
        optimizer = {
            name: 'adam',
            beta1: 0.9,
            beta2: 0.999,
            epsilon: 1e-4,
        }
    }) {
        this.features = train_features;
        this.labels = train_labels;
        this.validate_dat = validate_dat || null;
        this.feed_forward(this.features);
        this.backprop(this.activations, this.labels);
        this.optimizer = getOptimizer(optimizer.name);
        this.optimizer(this, neta, epoch, m, optimizer);
    }

    /* feed_forward : Calculates the activation of each layer.
     * @input : [array] , the input to the input layer
     * Returns : [a,z] ,  An array containing Activations of each layer
     *           and also the weighted inputs for each layer.  
     */

    feed_forward(input) {
        let activ = [],
            z = [],
            activ_ = [];

        activ.push(core.transpose(input));
        for (let i = 0; i < this.lyrs.length; i++) {
            let res = this.lyrs[i].fire(activ[i]);
            activ.push(core.transpose(res[0], 'float32'));
            z.push(res[1]);
            activ_.push(this.lyrs[i].activ_dash(z[i]));
        }

        this.activ_ = activ_;
        this.activations = activ;
        this.z = z;
    }

    /* backpropagation : Calculates the error in activation of every layer 
     * @a : [array] , The activation of the output layer
     * @y : [array] , The labels(desired output) for given input
     * Returns : [delw,delb], delw is an array of ndarrays having error in weights
     *           of every layer and delb is array of ndarrays having errors in biases
     */
    backprop(a, y) {
        let dw = [],
            db = [],
            grad_c = this.costFunction.grad(y, a) * this.activ_[this.lyrs_count - 1],
            delta = [];

        for (let i = 0; i < this.lyrs.length; i++) {
            dw.push(ndarray.zeroes(this.lyrs[i].weights.shape));
            db.push(ndarray.zeroes(this.lyrs[i].biases.shape));
        }

        delta[this.lyrs.length - 1] = core.transpose(grad_c, 'float32');
        //backpropogation
        for (let i = this.lyrs.length - 2; i >= 0; i--) {
            let wt = this.lyrs[i + 1].weights.transpose();
            let part_act = math.product(wt, delta[i + 1], 'matrix');
            delta[i] = math.product(part_act, core.transpose(this.activ_[i], 'float32'), 'dot');
        }

        for (let i = 0; i < this.lyrs.length; i++) {
            let activ = core.transpose(this.activations[i], 'float32');
            let part = math.product(delta[i], activ, 'matrix');
            dw[i].arrange(core.flatten(part));
            db[i].arrange(delta[i]);
        }

        this.dw = dw;
        this.db = db;
    }

    /* eval : evaluates the learning of network by comparing the accuracy */
    eval() {
        let cost = this.cost_function(this.labels, this.activations);

    }

    /* predict : Predicts the output for the given test feature 
     * @test_features : [array] , The features for which the prediction is 
     *                  to be made.
     * Returns : [array] , The activation of the output layer.                       
     */
    predict(test_features) {
        return this.feed_forward(test_features)[0][this.lyrs_count - 1];
    }
}

function getOptimizer(optName) {
    const optimizer = require('../util/optimizer');
    if (optName === 'adam') return optimizer.AdamOptimizer
    else if (optName === 'rmsprop') return optimizer.rmsProp;
    else if (optName === 'gd') return optimizer.GradientDescent.GD;
    else if (optName === 'sgd') return optimizer.GradientDescent.SGD;
    else if (optName === 'mbdg') return optimizer.GradientDescent.MBGD;
}

module.exports = Network;