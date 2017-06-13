/* JBrain : A neural network implementation in Javascript.
 *
 *
 * Project Name : JBrain
 * Project Code Name : JSimpl
 * Author : Anubhav Tiwari <atworkstudios@gmail.com>
 *
 */
/* Browser support not available , un-comment if using transpiler and comment require
statements for if not in node environment
 * import Vector from 'vector_js';
 * import net_util from 'net_util';
 */
const { lyr,sigma_dash,sigmoid_function,
		weighted_input,cost_grad,shuffle } = require('../util/net_util');
const cost = require('../util/cost');
const activ = require('../util/activ');
const {Vector,sum,product} = require('../node_modules/vecto');


/* define a network with net_config representing each layer with the number of 
 * neurons in them : net_config is an array, the length of the array determines the 
 * number of layers and each ith element of net_config defines the number of neurons
 * in the ith layer.
 */


class Network {
	constructor(net_config) {
		this.net_config = net_config;
		this.lyrs_count = net_config.length;
		this.weights = [];
		this.biases = [];

		/* Random initialization of weights and biases */
		for (let i = 1; i < this.lyrs_count; i++) {
			this.weights.push(lyr(this.net_config[i], this.net_config[i - 1]));
			this.biases.push(lyr(this.net_config[i]));
		}
	}

	/* Fit the Network (i.e., train) */

	fit({ train_features, train_labels, neta = 0.5, epoch = 10, m = 2, 
		  cost_fn = cost.cross_entropy, activ_fn = activ.sigmoid, evaluate=true,
		  eval_epoch=5, validate=false, validate_dat = null }) {
		// console.log(train_features);
		this.input = train_features;
		this.labels = train_labels;
		this.activ_fn = activ_fn;
		this.cost_fn = cost_fn;
		this.evaluate = evaluate;
		this.eval_epoch = eval_epoch;
		this.validate = validate;
		this.val_dat = validate_dat;
		/* optimise weights and biases for each input example x, by SGD using backprop */
		this.SGD(neta, epoch, m, cost_fn);
	}

	/* Feed forward the activation of each layer as input to next layer 
	and recieve the output of final layer as network's output */

	feed_forward(input, activ_fn=activ.sigmoid) {
		const activation = [];
		const Z = [];
		activation.push(input);
		for (let i = 1; i < this.lyrs_count; i++) {
			let z = weighted_input(this.weights[i-1].array, activation[i-1], this.biases[i-1].array);
			let activ = activ_fn(z);
			activation.push(activ);
			Z.push(z);
		}

		return [activation, Z];
	}

	/* SGD : (Stochastic Gradient Descent), Updates the weights and biases 
	by gradient descent using stochastic/online learning (values of w and b optimised for
	every example rather than averaging over the whole batch as in batch learning)
	*/

	SGD(neta, epoch, m, cost_fn) {
		const factor = -(neta / m);
		let x, y, delta_w, delta_b;
		while (epoch) {
			[x, y] = shuffle(this.input, m, this.labels);
			for (let i = 0; i < m; i++) {
                [delta_w, delta_b] = this.backprop(x[i], y[i]);
				/* Optimising weights and biases by gradient descent */
				for (let j = 1; j < this.lyrs_count; j++) {
					delta_w[j - 1].arrange(product(delta_w[j - 1].flat, factor));
					delta_b[j - 1].arrange(product(delta_b[j - 1].flat, factor));
				}

				/* Updating the weights and biases */

				for (let j = 1; j < this.lyrs_count; j++) {
					this.weights[j - 1].arrange(Vector.add(this.weights[j - 1], delta_w[j - 1])
						.flat);
					this.biases[j - 1].arrange(Vector.add(this.biases[j - 1], delta_b[j - 1])
						.flat);
				}
			}
			epoch--;
		}
	}

	/* backprop : calculates the error or noise in weights and biases and optimises the 
	   weights and biases to give more accurate results and thus modelling learning
	*/

	backprop(x, y) {
		let nw = [],
			nb = [];
		for (let i = 1; i < this.lyrs_count; i++) {
			nw.push(Vector.zeroes(this.weights[i - 1].shape));
			nb.push(Vector.zeroes(this.biases[i - 1].shape));
		}

		let a = [],
			z = [],
			delta = [];
        [a, z] = this.feed_forward(x, this.activ_fn);
		let grad_c = cost_grad(a[this.lyrs_count - 1], y);
		let sig_ = z[this.lyrs_count - 2].map((i) => {
			return sigma_dash(i);
		});

		delta[this.lyrs_count - 2] = product(sig_, grad_c);
		/* Backpropagating */
		for (let i = this.lyrs_count - 2; i >= 1; i--) {
			let ele = delta[i].length > 1 ? delta[i] : delta[i][0];
			let part_act = product(this.weights[i].array, ele);
			let sig_ = z[i - 1].map(i => sigma_dash(i))
			delta[i - 1] = product(part_act, sig_);
		}

		for (let i = 1; i < this.lyrs_count; i++) {
			/* plus the activation for last hidden layer(in this case lyr having 2 neurons
			contains 2 elems, but the delta for the output layer is scalar, thus uneven size error)
			*/
			let warr = [],
				barr = [];
			let ele = delta[i-1].length > 1 ? delta[i-1] : delta[i-1][0];
			let part = product(a[i - 1], ele);
			console.log(`activ = `,a[i-1]);
			console.log(`del = `,ele);
			Vector.flatten(part, warr);
			Vector.flatten(delta[i-1], barr);
			nw[i - 1].arrange(warr);
			nb[i - 1].arrange(barr);
		}
		return [nw, nb];
	}

	predict(test_features) {
		const res = this.feed_forward(test_features);
		return res[0][this.lyrs_count - 1];
	}

	evaluate(prediction, test_labels) {

		return (sum(test_labels, (-1 * (predictions))));
	}
}

module.exports = Network;
