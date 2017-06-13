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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* A JS library for dealing with n-dimensional vectors. 
 * Referenced from numpy.
 * Author : Anubhav Tiwari <atworkstudios@gmail.com>
 */
const sum = __webpack_require__(13);
const product = __webpack_require__(12);


class Vector {
	constructor(shape = [], arr = []) {
		this.array = arr;
		this.shape = ((shape.length) > 0) ? shape : (Vector.calc_shape(this.array));
		this.size = Vector.calc_size(this.shape);
		this.dim = this.find_dim();
		this.flat = [];
		Vector.flatten(this.array, this.flat);
	}

	/* class specific (static) methods */
	/* form a new vector for the given array */
	static array(arr) {
		return new Vector([], arr);
	}

	/* make a new zero Vector */
	static zeroes(shape) {
		let base_arr = Vector.fill(shape[shape.length - 1], "linear", 0);
		let arr = shape.length < 2 ? base_arr : [];
		for (let i = shape.length - 2; i >= 0; i--) {
			arr = [];
			for (let j = 0; j < shape[i]; j++) {
				arr.push(base_arr);
			}
			base_arr = arr;
		}
		return new Vector(shape, arr);
	}

	/* sum of 2 vectors */
	static add(v1, v2) {
		if (v1.shape.toString() === v2.shape.toString()) {
			let sum = [];
			for (let i = 0; i < v1.flat.length; i++) {
				sum[i] = v1.flat[i] + v2.flat[i];
			}
			let v = new Vector(v1.shape);
			v.arrange(sum, "linear");
			return v;
		}
		else {
			return new Error("Unequal Size");
		}
	}

	//    static dot(v2){

	//    }

	/* function to convert n-dimension array into 1-D array */

	static flatten(arr, tarr) {
		for (let i of arr) {
			if (Array.isArray(i)) {
				this.flatten(i, tarr);
			}
			else {
				tarr.push(i);
			}
		}
	}

	/* form chunks */
	static form_chunks(size,no,arr){
		let chunk = [],final = [], k = 0;
		for(let i=0; i<no; i++){
			chunk = [];
			for(let j=0; j<size; j++){
				chunk[j] = arr[k++];
				if(k>=arr.length) k =0;
			}
			final.push(chunk);
		}
		return final;
	}

	/* fills the vector acc to passed args */
	static fill(len, fill_style = "array", ...args) {
		const arr = [];
		let i;
		if (!args || args.length === 0) {
			for (i = 0; i < len; i++) {
				arr[i] = Math.random();
			}
		}
		else {
			if (args.length === 1) {
				if (Array.isArray(args[0]) && fill_style === "array") {
					for (i = 0; i < len; i++) {
						arr[i] = args[0];
					}
				}
				else if (Array.isArray(args[0]) && fill_style !== "array") {
					let j = 0;
					for (i = 0; i < len; i++) {
						arr[i] = args[0][j++];
						if (j >= args[0].length) {
							j = 0;
						}
					}
				}
				else {
					for (i = 0; i < len; i++) {
						arr[i] = args[0];
					}
				}
			}
			else {
				let min = args[0],
					max = args[1],
					step = (args.length === 3) ? args[2] : 1,
					num = min;
				for (i = 0; i < len; i++) {
					arr[i] = parseFloat((num).toPrecision(2));
					num += step;
					if (num > max) {
						num = min;
					}
				}
			}
		}
		return arr;
	}

	/* find the shape of array */
	static calc_shape(arr) {
		const shape = [];
		shape.push(arr.length);
		let a = arr[0];
		while (Array.isArray(a)) {
			shape.push(a.length);
			a = a[0];
		}
		return shape;
	}

	/* find the size of the array */
	static calc_size(shape) {
		let size = 1;
		for (let i of shape) {
			size *= i;
		}
		return size;
	}



	/* -------------------------------------------------------------------------------------------------------------------------------------------- */

	/* object specific (property) methods */

	/* find the shape of the given array */

	find_dim() {
		return this.shape.length;
	}

	/* a method to arrange or create a Vector from the given elements */
	arrange(elems_arr, fill_style = "linear") {
		let base_arr = elems_arr ? elems_arr : Vector.fill(Math.floor(this.size),"linear"),
		curr_arr = [];
		for(let i=this.dim - 1; i > 0; i--){
			let size = this.shape[i],no=i>1 ? this.shape[i-1]*this.shape[i-2] : this.shape[i-1];
			curr_arr = Vector.form_chunks(size,no,base_arr);
			base_arr = curr_arr;
		}
		this.array = base_arr;
		this.flat = [];
		Vector.flatten(this.array, this.flat);
	}

	/* reshapes the vector only if for the new shape the number of elements remain same */
	reshape(new_shape) {
		if (Vector.calc_size(new_shape) === this.size) {
			/* reshape */
			const temp_arr = this.flat;
			this.shape = new_shape;
			this.dim = this.find_dim();
			this.flat = [];
			this.arrange(temp_arr, "linear");
		}
		else {
			return new Error("Resizing error : can't change the size");
		}
	}

	/* changes the shape and size of the vector in place */
	resize(new_shape) {
		const temp_arr = this.flat;
		this.shape = new_shape;
		this.size = Vector.calc_size(new_shape);
		this.dim = this.find_dim();
		this.flat = [];
		this.arrange(temp_arr, "linear");
	}

	/* function to find the transpose */
	transpose() {
		/* converts row <-> columns */
		/* not that useful to main project as of now */
	}

	/* more to come */
}

module.exports = {
	sum: sum,
	product: product,
	Vector: Vector
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function sigmoid(z) {
	if (!Array.isArray(z)) {
		return 1 / 1 + Math.exp(-z);
	} else {
		var wip = [];
		z.forEach(function (i) {
			wip.push(1 / (1 + Math.exp(-i)));
		});

		return wip;
	}
}

module.exports = sigmoid;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var _require = __webpack_require__(10),
    lyr = _require.lyr,
    sigma_dash = _require.sigma_dash,
    sigmoid_function = _require.sigmoid_function,
    weighted_input = _require.weighted_input,
    cost_grad = _require.cost_grad,
    shuffle = _require.shuffle;

var cost = __webpack_require__(6);
var activ = __webpack_require__(4);

var _require2 = __webpack_require__(0),
    Vector = _require2.Vector,
    sum = _require2.sum,
    product = _require2.product;

/* define a network with net_config representing each layer with the number of 
 * neurons in them : net_config is an array, the length of the array determines the 
 * number of layers and each ith element of net_config defines the number of neurons
 * in the ith layer.
 */

var Network = function () {
	function Network(net_config) {
		_classCallCheck(this, Network);

		this.net_config = net_config;
		this.lyrs_count = net_config.length;
		this.weights = [];
		this.biases = [];

		/* Random initialization of weights and biases */
		for (var i = 1; i < this.lyrs_count; i++) {
			this.weights.push(lyr(this.net_config[i], this.net_config[i - 1]));
			this.biases.push(lyr(this.net_config[i]));
		}
	}

	/* Fit the Network (i.e., train) */

	_createClass(Network, [{
		key: 'fit',
		value: function fit(_ref) {
			var train_features = _ref.train_features,
			    train_labels = _ref.train_labels,
			    _ref$neta = _ref.neta,
			    neta = _ref$neta === undefined ? 0.5 : _ref$neta,
			    _ref$epoch = _ref.epoch,
			    epoch = _ref$epoch === undefined ? 10 : _ref$epoch,
			    _ref$m = _ref.m,
			    m = _ref$m === undefined ? 2 : _ref$m,
			    _ref$cost_fn = _ref.cost_fn,
			    cost_fn = _ref$cost_fn === undefined ? cost.cross_entropy : _ref$cost_fn,
			    _ref$activ_fn = _ref.activ_fn,
			    activ_fn = _ref$activ_fn === undefined ? activ.sigmoid : _ref$activ_fn,
			    _ref$evaluate = _ref.evaluate,
			    evaluate = _ref$evaluate === undefined ? true : _ref$evaluate,
			    _ref$eval_epoch = _ref.eval_epoch,
			    eval_epoch = _ref$eval_epoch === undefined ? 5 : _ref$eval_epoch,
			    _ref$validate = _ref.validate,
			    validate = _ref$validate === undefined ? false : _ref$validate,
			    _ref$validate_dat = _ref.validate_dat,
			    validate_dat = _ref$validate_dat === undefined ? null : _ref$validate_dat;

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

	}, {
		key: 'feed_forward',
		value: function feed_forward(input) {
			var activ_fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : activ.sigmoid;

			var activation = [];
			var Z = [];
			activation.push(input);
			for (var i = 1; i < this.lyrs_count; i++) {
				var z = weighted_input(this.weights[i - 1].array, activation[i - 1], this.biases[i - 1].array);
				var _activ = activ_fn(z);
				activation.push(_activ);
				Z.push(z);
			}

			return [activation, Z];
		}

		/* SGD : (Stochastic Gradient Descent), Updates the weights and biases 
  by gradient descent using stochastic/online learning (values of w and b optimised for
  every example rather than averaging over the whole batch as in batch learning)
  */

	}, {
		key: 'SGD',
		value: function SGD(neta, epoch, m, cost_fn) {
			var factor = -(neta / m);
			var x = void 0,
			    y = void 0,
			    delta_w = void 0,
			    delta_b = void 0;
			while (epoch) {
				var _shuffle = shuffle(this.input, m, this.labels);

				var _shuffle2 = _slicedToArray(_shuffle, 2);

				x = _shuffle2[0];
				y = _shuffle2[1];

				for (var i = 0; i < m; i++) {
					/* Optimising weights and biases by gradient descent */
					var _backprop = this.backprop(x[i], y[i]);

					var _backprop2 = _slicedToArray(_backprop, 2);

					delta_w = _backprop2[0];
					delta_b = _backprop2[1];
					for (var j = 1; j < this.lyrs_count; j++) {
						delta_w[j - 1].arrange(product(delta_w[j - 1].flat, factor));
						delta_b[j - 1].arrange(product(delta_b[j - 1].flat, factor));
					}

					/* Updating the weights and biases */

					for (var _j = 1; _j < this.lyrs_count; _j++) {
						this.weights[_j - 1].arrange(Vector.add(this.weights[_j - 1], delta_w[_j - 1]).flat);
						this.biases[_j - 1].arrange(Vector.add(this.biases[_j - 1], delta_b[_j - 1]).flat);
					}
				}
				epoch--;
			}
		}

		/* backprop : calculates the error or noise in weights and biases and optimises the 
     weights and biases to give more accurate results and thus modelling learning
  */

	}, {
		key: 'backprop',
		value: function backprop(x, y) {
			var nw = [],
			    nb = [];
			for (var i = 1; i < this.lyrs_count; i++) {
				nw.push(Vector.zeroes(this.weights[i - 1].shape));
				nb.push(Vector.zeroes(this.biases[i - 1].shape));
			}

			var a = [],
			    z = [],
			    delta = [];

			var _feed_forward = this.feed_forward(x, this.activ_fn);

			var _feed_forward2 = _slicedToArray(_feed_forward, 2);

			a = _feed_forward2[0];
			z = _feed_forward2[1];

			var grad_c = cost_grad(a[this.lyrs_count - 1], y);
			var sig_ = z[this.lyrs_count - 2].map(function (i) {
				return sigma_dash(i);
			});

			delta[this.lyrs_count - 2] = product(sig_, grad_c);

			/* Backpropagating */
			for (var _i = this.lyrs_count - 2; _i >= 1; _i--) {
				var ele = delta[_i].length > 1 ? delta[_i] : delta[_i][0];
				var part_act = product(this.weights[_i - 1].array, ele);
				var _sig_ = z[_i - 1].map(function (i) {
					return sigma_dash(i);
				});
				delta[_i - 1] = product(part_act, _sig_);
			}

			for (var _i2 = 1; _i2 < this.lyrs_count; _i2++) {
				/* plus the activation for last hidden layer(in this case lyr having 2 neurons
    contains 2 elems, but the delta for the output layer is scalar, thus uneven size error)
    */
				var warr = [],
				    barr = [];
				var _ele = delta[_i2 - 1].length > 1 ? delta[_i2 - 1] : delta[_i2 - 1][0];
				var part = product(a[_i2 - 1], _ele);
				Vector.flatten(part, warr);
				Vector.flatten(delta[_i2 - 1], barr);
				nw[_i2 - 1].arrange(warr);
				nb[_i2 - 1].arrange(barr);
			}
			return [nw, nb];
		}
	}, {
		key: 'predict',
		value: function predict(test_features) {
			var res = this.feed_forward(test_features);
			return res[0][this.lyrs_count - 1];
		}
	}, {
		key: 'evaluate',
		value: function evaluate(prediction, test_labels) {

			return sum(test_labels, -1 * predictions);
		}
	}]);

	return Network;
}();

module.exports = Network;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// import Network from 'Network';
// import svm from 'SVM';
// import naive_bayes from 'nb';
// import conv_net from 'convnet';

Network = __webpack_require__(2);
// svm = require('./brain/svm');
// naive_bayes = require('./brain/nb');
// conv_net = require('./brain/convnet');


module.exports = {
    Network: Network

    // export default Jbrain;

};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var sigmoid = __webpack_require__(1);
var softmax = __webpack_require__(5);

var activ = {
    sigmoid: sigmoid,
    softmax: softmax
};

module.exports = activ;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
    //TODO
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var quad_cost = __webpack_require__(9);
var cross_entropy = __webpack_require__(7);
var log_like = __webpack_require__(8);

var cost = {
    quad_cost: quad_cost,
    cross_entropy: cross_entropy,
    log_like: log_like
};

module.exports = cost;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    Vector = _require.Vector,
    sum = _require.sum,
    product = _require.product;
/* defines each layer's weight and biases, if two parameters are provided weights are
 * returned else biases.
 */


function lyr(neuron_count, ip_wts) {
    var fill_style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    var v = void 0;
    if (!ip_wts) {
        if (fill_style === 1) {
            v = new Vector([neuron_count]);
            v.arrange();
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

/* weighted_input : calculates sigma(w*x) + b */

function weighted_input(w, x, b) {
    var wa = product(w, x);
    var flb = [];
    Vector.flatten(b, flb);
    var z = sum(sum(wa), flb);
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
    var sigmoid = __webpack_require__(1);
    return sigmoid(z) * (1 - sigmoid(z));
}

function shuffle(input, mini_batch_size, labels) {
    var batch = [],
        y = [];
    var i = void 0;
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
    weighted_input: weighted_input,
    cost_grad: cost_grad,
    shuffle: shuffle

    // export default net_util;

};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = class Matrix{
    static matrix_prod(m1,m2){
        return "Bazziinnggaa";
    }

    static matrix_add(m1,m2){
        return "Double Bazziinnggaaa";
    }
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* product : test cases : 
^ *1 [a,b,c] * [x,y,z]  // equal length 1-d arrays
*2 [a,b,c] * [x,y]  // unequal length, must result in an uneven size error
*3 [a,b,c] * [x] || [a,b,c] * x  // if length of arg2 is 1 or if arg2 is scalar
*4 [[a,b,c],[d,e,f],[g,h,i]] * [a,b]  //arg1 is n-d but len(arg1) !== len(arg2), uneven size err
^ *5 [[a,b,c],[d,e,f]] * [x,y,z]  // len(arg1) !== len(arg2) but len(arg1[i]) == len(arg2), must multiply arg2 with each arg[i]
^ *6 a * x || [a] * [x]  // return a*x
*/
const Matrix = __webpack_require__(11);

function product(arr1, arr2) {
	let prod = [];
	if(Array.isArray(arr1) && !Array.isArray(arr2)){
		if(Array.isArray(arr1[0])){
			arr1.forEach(i=>{
				prod.push(product(i,arr2));
			})
		}
		else{
			arr1.forEach(i=>{
				prod.push(i*arr2);
			})
		}
	}

	else if(!Array.isArray(arr1) && Array.isArray(arr2)){
		return product(arr2,arr1);
	}

	else{
		if(Array.isArray(arr1[0]) && Array.isArray(arr2[0])){
			const { Vector } = __webpack_require__(0);
			let ar1_shape = Vector.calc_shape(arr1);
			let ar2_shape = Vector.calc_shape(arr2);
			if(ar1_shape.length === ar2_shape.length === 2){
				if(ar1_shape[1] === ar2_shape[0]){
					return Matrix.matrix_prod(arr1,arr2);
				}
				else{
					if(ar1_shape.toString() === ar2_shape.toString()){
						for(let i=0; i<ar1.length; i++){
							prod.push(product(ar1[i],ar2[i]));
						}
					}
					else{
						throw new Error("Uneven Size");
					}
				}
			}
		}
		else if(Array.isArray(arr1[0]) && !Array.isArray(arr2[0])){
			if(arr1.length === arr2.length){
				let j=0;
				arr1.forEach(i=>{
					prod.push(product(i,arr2[j++]));
				})
			}
			else if(arr1[0].length === arr2.length){
				arr1.forEach(i=>{
					prod.push(product(i,arr2));
				})
			}
			else{
				return new Error("Uneven Size");
			}
		}

		else if(!Array.isArray(arr1[0]) && Array.isArray(arr2[0])){
			return product(arr2,arr1);
		}

		else{
			if(arr1.length === arr2.length){
				let k=0;
				arr1.forEach(i=>{
					prod.push(i*arr2[k++]);
				})
			}
			else{
				throw new Error("Uneven Size");
			}
		}
	}
	return prod;
}

module.exports = product;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function sum(arr1, arr2) {
    let summ;
    if (!Array.isArray(arr1) && !Array.isArray(arr2)) {
        return arr1 + arr2;
    }
    else {
        if (!arr2) {
            if (Array.isArray(arr1[0])) {
                summ = arr1.map((i) => {
                    return sum(i);
                })
                return summ;
            }
            else {
                summ = 0;
                arr1.forEach((i) => {
                    summ += i;
                })
                return summ;
            }
        }
        if (Array.isArray(arr1) && !Array.isArray(arr2)) {
            summ = [];
            arr1.forEach((i) => {
                summ.push(i + arr2);
            });
        }
        else if (Array.isArray(arr2) && !Array.isArray(arr1)) {
            sum(arr2, arr1);
        }
        else {
            if (arr1.length === arr2.length) {
                summ = [];
                if (Array.isArray(arr1[0]) && Array.isArray(arr2[0])) {
                    for (let i = 0; i < arr1.length; i++) {
                        summ.push(sum(arr1[i], arr2[i]));
                    }
                }
                else {
                    for (let i = 0; i < arr1.length; i++) {
                        summ.push(arr1[i] + arr2[i]);
                    }
                }
            }
        }
    }
    return summ;
}

/***/ })
/******/ ]);