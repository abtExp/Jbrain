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

var net_util = require('../util/net_util');
var cost = require('../util/cost');
var activ = require('../util/activ');
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

        /* Random initialization of weights and biases */
        for(let i=1; i<this.lyrs_count; i++){
            this.weights.push(net_util.lyr(this.net_config[i],this.net_config[i-1]));
            this.biases.push(net_util.lyr(this.net_config[i]));
        }        
    }

    /* Fit the Network (i.e., train) */

    fit(train_features,train_labels,neta=0.5,epoch=10,m=2,cost_fn=cost.cross_entropy,activ_fn=activ.sigmoid){
        this.input = train_features;
        this.labels = train_labels;
        
        /* optimise weights and biases for each input example x, by SGD using backprop */
        this.SGD(epoch,neta,m,cost_fn);
    }

    /* Feed forward the activation of each layer as input to next layer 
    and recieve the output of final layer as network's output */

    feed_forward(input,activ_fn){
        var activation = [];
        var Z = [];
        activation.push(input);
        for(let i=1; i<this.lyrs_count; i++){
            let z = net_util.weighted_input(this.weights[i-1].array,activation[i-1],this.biases[i-1].array);
            let activ = activ_fn(z);
            activation.push(activ);
            Z.push(z);
        }

        return [activation,Z];
    }

    /* SGD : (Stochastic Gradient Descent), Updates the weights and biases 
    by gradient descent using stochastic/online learning (values of w and b optimised for
    every example rather than averaging over the whole batch as in batch learning)
    */

    SGD(neta,epoch,m,cost_fn){
        var factor = -(neta/m);
        var x,y,delta_w,delta_b;
        while(epoch){
            [x,y] = net_util.shuffle(this.input,m,this.labels);
            for(let i=0; i<m; i++){
                [delta_w,delta_b] =  this.backprop(x[i],y[i]);
                /* Optimising weights and biases by gradient descent */
                for(let j=1; j<this.lyrs_count; j++){
                    delta_w[j-1].arrange(vect.product(delta_w[j-1].flat,factor));
                    delta_b[j-1].arrange(vect.product(delta_b[j-1].flat,factor));
                }

                /* Updating the weights and biases */

                for(let j=1; j<this.lyrs_count; j++){
                    this.weights[j-1].arrange(vect.Vector.add(this.weights[j-1],delta_w[j-1]).flat);
                    this.biases[j-1].arrange(vect.Vector.add(this.biases[j-1],delta_b[j-1]).flat);
                }
            }
            epoch--;
        }
    }

    /* backprop : calculates the error or noise in weights and biases and optimises the 
	   weights and biases to give more accurate results and thus modelling learning
	*/

    backprop(x,y){
        var nw = [],nb = [];
        for(let i=1; i<this.lyrs_count; i++){
            nw.push(vect.Vector.zeroes(this.weights[i-1].shape));
            nb.push(vect.Vector.zeroes(this.biases[i-1].shape));
        }

        var a,z,delta = [];
        [a,z] = this.feed_forward(x);
        var grad_c = net_util.cost_grad(a[this.lyrs_count-1],y);
        var sig_ = z[this.lyrs_count-1].map((i)=>{
            net_util.sigma_dash(i);
        });

        delta.push(vect.product(sig_,grad_c));

        /* Backpropagating */
        for(let i=this.lyrs_count-2; i>=1; i--){
            var ele = delta[i+1].length > 1 ? delta[i+1] : delta[i+1][0];
            var part_act = vect.product(this.weights[i-1].array,ele);
            delta.unshift(vect.product(part_act,z[i-1]));
        }

        for(let i = 1; i<this.lyrs_count; i++){
            nw[i-1].arrange(vect.product(a[i-1],delta[i]));
            nb[i-1].arrange(delta[i])
        }

        return [nw,nb];      
    }

    predict(test_features){
        var res = this.feed_forward(test_features);
        return res[res.length-1];
    }

    evaluate(prediction,test_labels){
        return (vect.sum(test_labels,(-1*(predictions))));
    }
}

module.exports = Network;