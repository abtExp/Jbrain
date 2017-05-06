/* JBrain : The Brain of Jason , your SEO agent.
 * A neural network implementation in Javascript.
 *
 *
 * Project Name : JBrain
 * Project Code Name : JSimpl
 * Version : 0.0.1
 * Author : Anubhav Tiwari <atworkstudios@gmail.com>
 *
 */

/* Browser support not available 
 * import Vector from 'Vector';
 * import net_util from 'net_util';
 */

var net_util = require('./util/net_util');
var vect = require('vector_js');


/* define a network with net_config representing each layer with the number of 
 * neurons in them : net_config is an array, the length of the array determines the 
 * number of layers and each ith element of net_config defines the number of neurons
 * in the ith layer.
 */

class Network{
	constructor(net_config){
		this.net_config = net_config;
		this.lyrs_count = this.net_config.length;
		this.weights = [];
		this.biases = [];
		this.Z = [];
		for(var i=1; i<this.lyrs_count; i++){
			this.weights.push(net_util.lyr(this.net_config[i],this.net_config[i-1]));
			this.biases.push(net_util.lyr(this.net_config[i]));
		}
	}
	
	/* fit : method to optimise weights and biases by passing in the training_Data */

	fit(train_features, train_labels, neta=0.5, epoch=40, m=10/*, cost=cross_entropy*/){
		this.input = train_features;
		this.labels = train_labels;
		this.activations = [];
		/*this.cost = Cost.cost;*/
		/* for each input we find the activations and store them in an array */
		this.input.forEach((i)=>{this.activations.push(this.feed_forward(i));});
		this.SGD(neta,epoch,m);
		/* this.evaluate(); */
	}

	/* feed_forward : method to calculate the activations for each neuron of each layer
	 * by the sigmoid activation function and returning the activation for each layer for 
	 * each neuron for a given input data.
	 */

	feed_forward(input){
		var activation = [],z=[];
		activation.push(input);
		for(var i=1; i<this.lyrs_count; i++){
			console.log(`Layer No.: ${i}`);
			var part_act = [],z_min = [];
			for(var j=0; j<this.net_config[i]; j++){
				part_act.push(net_util.sigmoid_function(z_min[j] = net_util.weighted_input(this.weights[i-1],activation[i-1],this.biases[i-1],j)));
			}
			activation.push(part_act);
			z.push(z_min);
		}
		this.Z.push(z);
		return activation;
	}

	/* SGD (Stochastic Gradient Descent): performs optimisation of weights by calculating the delta w and delta b
	 * by the backpropagation method.
	 */

	SGD(neta,epoch,m){   
		var n = epoch;
		while(epoch > 0){
			console.log(`Epoch ${n-epoch}`);
			var i = Math.round(Math.random()*(this.input.length-1));
			var j = 0 ;
			while(j<m){
				var delW_B = this.backprop(i++);
				if(i>=this.input.length){
					i =0;
				}
				var delw = delW_B[0], delb = delW_B[1];
				/* updation of weights and biases by Stochastic Gradient Descent */

				for(var nl =1; nl<this.lyrs_count; nl++){
					delw[nl-1].arrange(vect.product(delw[nl-1].flat,(-(neta/m))));
					delb[nl-1].arrange(vect.product(delb[nl-1].flat,(-(neta/m))));
				}

				/* updating the weights */
				for(var l=1; l<this.lyrs_count; l++){
					this.weights[l-1].arrange(vect.Vector.add(this.weights[l-1],delw[l-1]).flat);
					this.biases[l-1].arrange(vect.Vector.add(this.biases[l-1],delb[l-1]).flat);
				}
				j++;
			}
			epoch--;
		}
	}

	/* backprop : calculates the error or noise in weights and biases and optimises the 
	   weights and biases to give more accurate results and thus modelling learning
	*/

	backprop(ip_num){
		let nw = [],nb = [];
		let delW_B = []; 
   		for(let i=1; i<this.lyrs_count; i++){
			nw.push(vect.Vector.zeroes(this.weights[i-1].shape));
			nb.push(vect.Vector.zeroes(this.biases[i-1].shape));
		}	

		/* calculating the error in the output layer */
		let del = [];
		let sig_ = [];
		this.Z[ip_num][this.lyrs_count-2].forEach((i)=>{sig_.push(net_util.sigma_dash(i));});
		/* this.Z[ip_num][this.lyrs_count-1] was undefined because we're just storing lyrs_count - 1 lyrs in Z as the input lyr 
		doesn't have weights and biases */
		var gradC = net_util.cost_grad(this.activations[ip_num][this.lyrs_count-1],this.labels[ip_num]);
		let opdel = vect.product(sig_,gradC);
		del[this.lyrs_count-1] = opdel;
		/* backpropagating */
		for(let i = this.lyrs_count-2; i>=1; i--){
			var ele = del[i+1];
			if(del[i+1].length == 1){
				ele = del[i+1][0];
			}
			var partErr = vect.product(this.weights[i-1].array,ele);
			/* Error Here */
			console.log(`weights for layer ${i} = ${this.weights[i-1].array}`);
			console.log(`delta for l+1 layer = ${ele}`);
			console.log(`w(l+1).del(l+1) = ${partErr}`);
			let err = vect.product(partErr,this.Z[ip_num][i-1]);
      		console.log(`partErr.sigma'(z(l)) = ${err}`);
      		/* error : del contains only 1 element at the stage for 
			calculating the error for the second last layer thus del[i+1] i.e., del[2] will be undefined */
			console.log(`Error terms in layer ${i} = ${err}`);
			del[i] = err;
			/* equivalent to nw = 0 (initially), nb = 0 (initially),
			   now we set nw = a.del, nb = del; (for ith layer) 
			*/
    }

	for(var i=1; i<this.lyrs_count; i++){
		for(var j=0; j<this.net_config[i]; j++){
			  nw[i-1].array[j] = (vect.product(this.activations[ip_num][i-1],del[i][j])); 
			  nb[i-1].array[j] = del[i][j];
		}
		nw[i-1].flat = [];
		nb[i-1].flat = [];
		nw[i-1].flatten(nw[i-1].array);
		nb[i-1].flatten(nb[i-1].array);
	}

		delW_B[0] = nw;
		delW_B[1] = nb;
		return delW_B;
	}

	predict(test_features){
		var res = this.feed_forward(test_features);
		return res[this.lyrs_count-1];
	}

}

module.exports = Network;
