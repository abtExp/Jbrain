/* JBrain : The Brain of Jason , your SEO agent.
 * A neural network implementation in Javascript.
 *
 *
 * Project Name : JBrain
 * Project Code Name : JSimpl
 * Version : 0.1.1
 * Author : Anubhav Tiwari <atworkstudios@gmail.com>
 *
 */

/* Browser support not available , un-comment if using transpiler and comment require
statements for if not in node environment

 * import Vector from 'Vector';
 * import net_util from 'net_util';
 */

var net_util = require('./util/net_util');
var cost = require('./util/cost');
var activ = require('./util/activ');
var vect = require('vector_js');


/* define a network with net_config representing each layer with the number of 
 * neurons in them : net_config is an array, the length of the array determines the 
 * number of layers and each ith element of net_config defines the number of neurons
 * in the ith layer.
 */


class Network{
    constructor(net_config){
        this.net_config = net_config;
        this.lyrs_count = net_config.length;
        this.weights = [];
        this.biases = [];
        this.Z = [];

        /* Random initialization of weights and biases */
        for(var i=1; i<this.lyrs_count; i++){
            this.weights.push(net_util.lyr(this.net_config[i],this.net_config[i-1]));
            this.biases.push(net_util.lyr(this.net_config[i]));
        }        
    }

    /* Fit the Network (i.e., train) */

    fit(train_features,train_labels,neta=0.5,epoch=10,m=2,cost_fn=cost.cross_entropy,activ_fn=activ.sigmoid){
        this.input = train_features;
        this.labels = train_labels;
        this.activations = [];

        /* optimise weights and biases for each input example x, by SGD using backprop */
        this.input.forEach((i)=>{
            this.activations.push(this.feed_forward(i,activ_fn));
        })

        this.SGD(epoch,neta,m,cost_fn);
    }

    /* Feed forward the activation of each layer as input to next layer 
    and recieve the output of final layer as network's output */

    feed_forward(input,activ_fn){
        var activation = [];
        activation.push(input);
        for(var i=1; i<this.lyrs_count; i++){
            let z = net_util.weighted_input(this.weights[i-1].array,activation[i-1],this.biases[i-1].array);
            let activ = activ_fn(z);
            activation.push(activ);
            this.Z.push(z);
        }

        return activation;
    }

    /* SGD : (Stochastic Gradient Descent), Updates the weights and biases 
    by gradient descent using stochastic/online learning (values of w and b optimised for
    every example rather than averaging over the whole batch as in batch learning)
    */

    SGD(neta,epoch,m,cost_fn){
        var factor = -(neta/m);
        while(epoch){
            var mini_batch = net_util.shuffle(this.input,m);
            var delW_B = this.backprop(mini_batch);
            var delta_w = delW_B[0];
            var delta_b = delW_B[1];

            /* Optimising weights and biases by gradient descent */

            for(var i=1; i<this.lyrs_count; i++){
                delta_w[i-1].arrange(vect.product(delta_w[i-1].flat,factor));
                delta_b[i-1].arrange(vect.product(delta_b[i-1].flat,factor));
            }

            /* Updating the weights and biases */

            for(var j=1; j<this.lyrs_count; j++){
                this.weights[j-1].arrange(vect.Vector.add(this.weights[j-1],delta_w[j-1]).flat);
                this.biases[j-1].arrange(vect.Vector.add(this.biases[j-1],delta_b[j-1]).flat);
            }
            
            epoch--;
        }
    }

    /* backprop : calculates the error or noise in weights and biases and optimises the 
	   weights and biases to give more accurate results and thus modelling learning
	*/

    backprop(mini_batch){
        //TODO
    }

    predict(test_features){
        var res = this.feed_forward(test_features);
        return res;
    }

    evaluate(){
        //TODO
    }
}

module.exports = Network;