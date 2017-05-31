/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

// import Network from 'Network';
// import svm from 'SVM';
// import naive_bayes from 'nb';
// import conv_net from 'convnet';

Network = __webpack_require__(1);
// svm = require('./brain/svm');
// naive_bayes = require('./brain/nb');
// conv_net = require('./brain/convnet');

var Jbrain = {
    Network : Network//,
    // SVM : svm,
    // nb : naive_bayes,
    // conv_net : conv_net
};

module.exports = Jbrain;

// export default Jbrain;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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

var net_util = __webpack_require__(10);
var cost = __webpack_require__(6);
var activ = __webpack_require__(3);
var vect = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../node_modules/vector_js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));


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

    fit({train_features,train_labels,neta=0.5,epoch=10,m=2,cost_fn=cost.cross_entropy,activ_fn=activ.sigmoid}){
        this.input = train_features;
        this.labels = train_labels;
        this.activ_fn = activ_fn;
        this.cost_fn = cost_fn;
        /* optimise weights and biases for each input example x, by SGD using backprop */
        this.SGD(neta,epoch,m,cost_fn);
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

        var a=[],z=[];
        var delta = [];
        [a,z] = this.feed_forward(x,this.activ_fn);
        var grad_c = net_util.cost_grad(a[this.lyrs_count-1],y);
        let sig_ = z[this.lyrs_count-1].map((i)=>{
            return net_util.sigma_dash(i);
        });

        delta[this.lyrs_count-2] = vect.product(sig_,grad_c);

        /* Backpropagating */
        for(let i=this.lyrs_count-2; i>=1; i--){
            var ele = delta[i].length > 1 ? delta[i] : delta[i][0];
            var part_act = vect.product(this.weights[i-1].array,ele);
            let sig_ = z[i-1].map(i=>sigma_dash(i))
            delta[i-1] = vect.product(part_act,sig_);
        }

        for(let i = 1; i<this.lyrs_count; i++){
            /* plus the activation for last hidden layer(in this case lyr having 2 neurons
            contains 2 elems, but the delta for the output layer is scalar, thus uneven size error)
            */
            var warr = [], barr = [];
            vect.Vector.flatten(vect.product(a[i-1],delta[i-1]),arr);
            vect.Vector.flatten(delta[i-1],barr);
            nw[i-1].arrange(warr);
            nb[i-1].arrange(barr);
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var Jbrain = __webpack_require__(0);

var net = new Jbrain.Network([3,2,1]);

var train_features = [[1,2,3],[4,2,0],[0,0,0]];
var train_labels = [0,1,0];

net.fit({train_features,train_labels, epoch: 4});

var predict = net.predict([2,1,0]);
console.log(predict);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var sigmoid = __webpack_require__(4);
var softmax = __webpack_require__(5);

var activ = {
    sigmoid : sigmoid,
    softmax : softmax
}

module.exports = activ;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function sigmoid(z){
    if(!Array.isArray(z)){
		return (1/1+(Math.exp(-z)));
	}
	else{
		var wip = [];
		z.forEach((i)=>{
			wip.push((1/(1+(Math.exp(-i)))));
		});

		return wip;
	}
}

module.exports = sigmoid;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function(){
    //TODO
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var quad_cost = __webpack_require__(9);
var cross_entropy = __webpack_require__(7);
var log_like = __webpack_require__(8);

var cost = {
    quad_cost : quad_cost,
    cross_entropy : cross_entropy,
    log_like : log_like
}

module.exports = cost;

/***/ }),
/* 7 */
/***/ (function(module, exports) {



/***/ }),
/* 8 */
/***/ (function(module, exports) {



/***/ }),
/* 9 */
/***/ (function(module, exports) {



/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const { Vector, sum, product } = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../node_modules/vector_js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
/* defines each layer's weight and biases, if two parameters are provided weights are
 * returned else biases.
 */
function lyr(neuron_count, ip_wts, fill_style = 1) {
    var v;
    if (!ip_wts) {
        if (fill_style === 1) {
            v = new Vector([neuron_count]);
            v.array = Vector.fill(neuron_count);
        } else {
            v = Vector.zeroes([neuron_count]);
        }
    } else {
        if (fill_style === 1) {
            v = new Vector([neuron_count, ip_wts]);
            v.arrange();
        } else {
            v = Vector.zeroes([neuron_count, ip_wts]);
        }
    }
    return v;
}


/* sigmoid_function : performs the sigmoid activation function */

function sigmoid_function(z) {
    if (!Array.isArray(z)) {
        return (1 / 1 + (Math.exp(-z)));
    } else {
        var wip = z.map((i) => {
            return (1 / (1 + (Math.exp(-i))));
        });

        return wip;
    }
}

/* weighted_input : calculates sigma(w*x) + b */

function weighted_input(w, x, b) {
    var wa = product(w, x);
    var flb = [];
    Vector.flatten(b, flb);
    let z = sum(sum(wa), flb);
    return z;
}

/* cost_grad : returns gradC wrt activ */

function cost_grad(a, y) {
    for (var i = 0; i < y.length; i++) {
        y[i] = -y[i];
    }
    var gradC = sum(a, y);
    return gradC;
}

/* sigma_dash : returns the sigma' for calculating the errors. */

function sigma_dash(z) {
    return (sigmoid_function(z) * (1 - (sigmoid_function(z))));
}

function shuffle(input, mini_batch_size, labels) {
    var batch = [],
        y = [];
    var i;
    while (batch.length <= mini_batch_size) {
        i = Math.floor(Math.random() * input.length);
        batch.push(input[i]);
        y.push(labels[i]);
    }
    return [batch, y];
}



module.exports = {
    lyr: lyr,
    sigma_dash: sigma_dash,
    sigmoid_function: sigmoid_function,
    weighted_input: weighted_input,
    cost_grad: cost_grad,
    shuffle: shuffle
}


// export default net_util;

/***/ })
/******/ ]);