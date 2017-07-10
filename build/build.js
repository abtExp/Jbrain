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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* a method to arrange or create a Vector from the given elements */
module.exports = function arrange(shape,elems_arr) {
    const calc_size = __webpack_require__(6);
    const fill = __webpack_require__(8);
    const form_chunks = __webpack_require__(9);
    let base_arr = elems_arr ? elems_arr : fill(Math.floor(calc_size(shape)),"linear"),
    curr_arr = [];
    for(let i=shape.length - 1; i > 0; i--){
        let size = shape[i],no=i>1 ? shape[i-1]*shape[i-2] : shape[i-1];
        curr_arr = form_chunks(size,no,base_arr);
        base_arr = curr_arr;
    }
    return base_arr;
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/* find the shape of array */
module.exports = function calc_shape(arr) {
    const shape = [];
    shape.push(arr.length);
    let a = arr[0];
    while (Array.isArray(a)) {
        shape.push(a.length);
        a = a[0];
    }
    return shape;
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* function to convert n-dimension array into 1-D array */
module.exports = function flatten(arr, tarr) {
    for (let i of arr) {
        if (Array.isArray(i)) {
            flatten(i, tarr);
        }
        else {
            tarr.push(i);
        }
    }
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function form_arr(arr,dtype='uint8'){
    switch(dtype){
        case 'uint8':
            return new Uint8Array(arr);

        case 'uint16':
            return new Uint16Array(arr);

        case 'uint32':
            return new Uint32Array(arr);

        case 'int8':
            return new Int8Array(arr);
        
        case 'int16':
            return new Int16Array(arr);

        case 'int32':
            return new Int32Array(arr);

        case 'float32':
            return new Float32Array(arr);

        case 'float64':
            return new Float64Array(arr);

        case 'uint8clamped':
            return new Uint8ClampedArray(arr);

        default:
            return new Array(arr);
    }
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const ndarray = __webpack_require__(21);
const sum = __webpack_require__(24);
const product = __webpack_require__(23);
const core = __webpack_require__(7);

module.exports = {
    ndarray : ndarray,
    sum : sum,
    product : product,
    core : core
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(4),
    ndarray = _require.ndarray,
    sum = _require.sum,
    product = _require.product,
    core = _require.core;

/* weighted_input : calculates sigma(w*x) + b */

function weighted_input(w, x, b) {
    var wa = product(w, x, 'dot');
    var sigwx = sum(wa);
    var z = sum(sigwx, b); // whatif bias is a single element ? 
    //As in for the output array or any hidden layer have only 1 neuron
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

function shuffle(input, mini_batch_size, labels) {
    var batch = [],
        y = [],
        i = void 0;
    while (batch.length <= mini_batch_size) {
        i = Math.floor(Math.random() * input.length);
        batch.push(input[i]);
        y.push(labels[i]);
    }
    return [batch, y];
}

module.exports = {
    weighted_input: weighted_input,
    cost_grad: cost_grad,
    shuffle: shuffle
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

/* find the size of the array */
module.exports = function calc_size(shape) {
    let size = 1;
    for (let i=0; i<shape.length; i++) {
        size *= shape[i];
    }
    return size;
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const form_arr = __webpack_require__(3);
const calc_shape= __webpack_require__(1);
const calc_size = __webpack_require__(6);
const find_dim = __webpack_require__(20);
const flatten  = __webpack_require__(2);
const fill = __webpack_require__(8);
const form_chunks = __webpack_require__(9);
const transpose = __webpack_require__(22);
const arrange  = __webpack_require__(0);


module.exports = {
    form_arr : form_arr,
    calc_shape:calc_shape,
    calc_size : calc_size,
    find_dim : find_dim,
    flatten : flatten,
    fill : fill,
    form_chunks : form_chunks,
    transpose : transpose,
    arrange : arrange
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

/* fills the vector acc to passed args */
module.exports = function fill(len, fill_style = "linear", ...args) {
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

/***/ }),
/* 9 */
/***/ (function(module, exports) {

/* form chunks */
module.exports = function form_chunks(size,no,arr){
    let chunk = [],final = [], k = 0;
    for(let i=0; i<no; i++){
        chunk = [];
        for(let j=0; j<size; j++){
            chunk[j] = arr[k++];
            if(k>=arr.length) k=0;
        }
        final.push(chunk);
    }
    return final;
}

/***/ }),
/* 10 */
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

/* Support not available , un-comment if using transpiler
 * import { ndarray, sum, product, core } from '../node_modules/vecto';
 * import { cost_grad, shuffle } from '../util/net_util';
 * import cost form '../util/cost';
 * import lyr from '../util/layers';
 */
var _require = __webpack_require__(5),
    cost_grad = _require.cost_grad,
    shuffle = _require.shuffle,
    cost = __webpack_require__(15),
    lyr = __webpack_require__(19),
    _require2 = __webpack_require__(4),
    ndarray = _require2.ndarray,
    sum = _require2.sum,
    product = _require2.product,
    core = _require2.core;

/* define a network with net_config representing each layer with the number of 
 * neurons in them : net_config is an array, the length of the array determines the 
 * number of layers and each ith element of net_config defines the number of neurons
 * in the ith layer.
 */

var Network = function () {
    /* Constructor
    * 
    * @net_config : [array ( int )], ( the layer wise representation of the network)
    * @lyr_type : 'String' ( The type of neurons, the layer consists of )
    * Possible types : sigmoid, softmax, relu, etc.
    * @op_lyr : 'String' ( Type of neurons in the output layer )
    */

    function Network(net_config) {
        var lyr_type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'sigmoid';
        var op_lyr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sigmoid';

        _classCallCheck(this, Network);

        this.net_config = net_config;
        this.lyrs_count = net_config.length;
        this.lyrs = [];
        this.activ_ = [];
        /* Make Layers by providing input weights and the 
              neuron count for lth layer and also the type of layer */
        for (var i = 1; i < this.lyrs_count - 1; i++) {
            this.lyrs.push(new lyr(this.net_config[i], this.net_config[i - 1], lyr_type));
        }
        // output layer
        this.lyrs.push(new lyr(this.net_config[this.lyrs_count - 2], this.net_config[this.lyrs_count - 1], op_lyr));
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
                _ref$evaluate = _ref.evaluate,
                evaluate = _ref$evaluate === undefined ? true : _ref$evaluate,
                _ref$eval_epoch = _ref.eval_epoch,
                eval_epoch = _ref$eval_epoch === undefined ? 5 : _ref$eval_epoch,
                _ref$validate = _ref.validate,
                validate = _ref$validate === undefined ? false : _ref$validate,
                _ref$validate_dat = _ref.validate_dat,
                validate_dat = _ref$validate_dat === undefined ? null : _ref$validate_dat;

            var n = 0;
            this.input = train_features;
            this.labels = train_labels;

            // Training the network

            while (n < epoch) {
                //forming mini batches
                var activation = [],
                    x = [],
                    y = [];

                //updating weights and biases
                var _shuffle = shuffle(this.input, m, this.labels);

                var _shuffle2 = _slicedToArray(_shuffle, 2);

                x = _shuffle2[0];
                y = _shuffle2[1];
                for (var i = 0; i < x.length; i++) {
                    var a = [],
                        z = [],
                        delw = [],
                        delb = [];

                    var _feed_forward = this.feed_forward(x[i]);

                    var _feed_forward2 = _slicedToArray(_feed_forward, 2);

                    a = _feed_forward2[0];
                    z = _feed_forward2[1];

                    this.z = z;
                    this.activations = a;

                    var _backprop = this.backprop(a[this.lyrs_count - 1], y[i]);

                    var _backprop2 = _slicedToArray(_backprop, 2);

                    delw = _backprop2[0];
                    delb = _backprop2[1];

                    this.SGD(neta, m, cost_fn, delw, delb);
                }

                //EVALUATE
                if (evaluate) {
                    if (n % eval_epoch === 0) {
                        this.eval();
                    }
                }
                n++;
            }
        }

        /* feed_forward : Calculates the activation of each layer.
        * @input : [array] , the input to the input layer
        * Returns : [a,z] ,  An array containing Activations of each layer
        *           and also the weighted inputs for each layer.  
        */

    }, {
        key: 'feed_forward',
        value: function feed_forward(input) {
            var activ = [],
                z = [],
                activ_ = [];

            activ.push(input);
            for (var i = 0; i < this.lyrs.length; i++) {
                var res = this.lyrs[i].fire(activ[i - 1]);
                activ.push(res[0]);
                z.push(res[1]);
                activ_.push(this.lyrs[i].activ_dash(z[i]));
            }

            this.activ_ = activ_;
            return [activ, z];
        }

        /* SGD : Stochastic Gradient Descent, Stepwise learning 
        * @neta : fl.oat value, the learning rate
        * @m : int , the number of epochs
        * @cost : 'String' , the name of the cost function,
        *         currently only 'quad_cost' and 'cross_entropy' are 
        *         supported
        * @delw : [array[ndarrays]] , the dc/dw
        * @delb : [array[ndarrays]] , the dc/db
        * Returns : Nothing , just performs gradient descent and optimises weights
        *           and biases
        */

    }, {
        key: 'SGD',
        value: function SGD(neta, m, cost, delw, delb) {
            var factor = -(neta / m);

            //optimising weights and biases
            for (var i = 0; i < this.lyrs.length - 1; i++) {
                delw[i].arrange(product(delw[i].array, factor));
                delb[i].arrange(product(delb[i].array, factor));
                this.lyrs[i].weights.add(delw[i]);
                this.lyrs[i].biases.add(delb[i]);
            }
        }

        /* backpropagation : Calculates the error in activation of every layer 
        * @a : [array] , The activation of the output layer
        * @y : [array] , The labels(desired output) for given input
        * Returns : [delw,delb], delw is an array of ndarrays having error in weights
        *           of every layer and delb is array of ndarrays having errors in biases
        */

    }, {
        key: 'backprop',
        value: function backprop(a, y) {
            var delw = [],
                delb = [],
                grad_c = cost_grad(a, y),
                delta = [];

            for (var i = 0; i < this.lyrs.length; i++) {
                delw.push(ndarray.zeroes(this.lyrs[i].weights.shape));
                delb.push(ndarray.zeroes(this.lyrs[i].biases.shape));
            }

            delta[this.lyrs.length - 1] = product(grad_c, this.activ_[this.lyrs_count - 2], 'dot');

            //backpropogation
            for (var _i = this.lyrs.length - 2; _i >= 0; _i--) {
                for (var j = 0; j < this.lyrs[_i + 1].weights.array.length; j++) {
                    var wt = core.transpose(this.lyrs[_i + 1].weights.array[j]);
                    var part_act = product(wt, delta[_i + 1], 'matrix');
                    delta[_i] = product(part_act, this.activ_[_i], 'dot');
                }
            }

            //needs to be tested
            for (var _i2 = 0; _i2 < this.lyrs.length; _i2++) {
                var part = product(this.activations[_i2], delta[_i2]);
                var fpart = [];
                core.flatten(part, fpart);
                delw[_i2].arrange(fpart);
                delb[_i2].arrange(delta[_i2]);
            }

            return [delw, delb];
        }

        /* eval : evaluates the learning of network by comparing the accuracy */

    }, {
        key: 'eval',
        value: function _eval() {}

        /* predict : Predicts the output for the given test feature 
        * @test_features : [array] , The features for which the prediction is 
        *                  to be made.
        * Returns : [array] , The activation of the output layer.                       
        */

    }, {
        key: 'predict',
        value: function predict(test_features) {
            return this.feed_forward(test_features)[0][this.lyrs_count - 1];
        }
    }]);

    return Network;
}();

module.exports = Network;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// import Network from 'Network';
// import svm from 'SVM';
// import naive_bayes from 'nb';
// import conv_net from 'convnet';

Network = __webpack_require__(10);
// svm = require('./brain/svm');
// naive_bayes = require('./brain/nb');
// conv_net = require('./brain/convnet');


module.exports = {
    Network: Network

    // export default Jbrain;

};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var sigmoid = __webpack_require__(13);
var softmax = __webpack_require__(14);

var activ = {
    sigmoid: sigmoid,
    softmax: softmax
};

module.exports = activ;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function sigmoid(z) {
	if (!Array.isArray(z)) {
		return 1 / 1 + Math.exp(-z);
	} else {
		var wip = z.map(function (i) {
			return 1 / (1 + Math.exp(-i));
		});
		return wip;
	}
}

sigmoid.dash = function (z) {
	if (!Array.isArray(z)) {
		return sigmoid(z) * (1 - sigmoid(z));
	} else {
		var dash = z.map(function (i) {
			return sigmoid(i) * (1 - sigmoid(i));
		});
	}
};

module.exports = sigmoid;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (z_i, z) {
    var avg = 0;
    for (var i = 0; i < z.length; i++) {
        avg += Math.exp(z[i]);
    }
    return Math.exp(z_i) / avg;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var quad_cost = __webpack_require__(18);
var cross_entropy = __webpack_require__(16);
var log_like = __webpack_require__(17);

var cost = {
    quad_cost: quad_cost,
    cross_entropy: cross_entropy,
    log_like: log_like
};

module.exports = cost;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
    function lyr(ip_wts, neuron_count) {
        var neuron_type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sigmoid';

        _classCallCheck(this, lyr);

        var activ = __webpack_require__(12),
            _require = __webpack_require__(4),
            ndarray = _require.ndarray;


        this.neurons = neuron_count;
        this.weights = new ndarray([ip_wts, neuron_count]);
        this.biases = new ndarray([neuron_count]);
        this.activation_fn = activ.neuron_type;
        this.weights.arrange();
        this.biases.arrange();
    }

    // Calculates activation for this layer


    _createClass(lyr, [{
        key: 'fire',
        value: function fire(x) {
            var _require2 = __webpack_require__(5),
                weighted_input = _require2.weighted_input;

            var z = weighted_input(this.weights.array, x, this.biases.array),
                a = this.activation_fn(z);
            this.activ_ = activ_dash(z);
            return [a, z];
        }

        //Performs activ_dash

    }, {
        key: 'activ_dash',
        value: function activ_dash(z) {
            return this.activation_fn.dash(z);
        }
    }]);

    return lyr;
}();

/***/ }),
/* 20 */
/***/ (function(module, exports) {

/* find the dimension of the array */
module.exports = function find_dim(shape) {
    return shape.length;
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/* A JS library for dealing with n-dimensional arrays. 
 * Referenced from numpy.
 * Author : Anubhav Tiwari <atworkstudios@gmail.com>
 */

const core = __webpack_require__(7);

class ndarray {
	constructor(shape=[],arr=[], dtype='uint8') {
		this.array = arr;
		this.shape = ((shape.length) > 0) ? shape : (core.calc_shape(this.array));
		this.size = core.calc_size(this.shape);
		this.dim = core.find_dim(this.shape);
		let temp = []
		this.dtype = dtype;
		core.flatten(this.array, temp);
		this.flat = core.form_arr(temp,this.dtype);
	}

	/* class specific (static) methods */
	/* form a new ndarray for the given array */
	static array(arr) {
		return new ndarray([], arr);
	}

	/* make a new zero ndarray */
	static zeroes(shape) {
		let base_arr = core.fill(shape[shape.length - 1], "linear", 0);
		let arr = shape.length < 2 ? base_arr : [];
		for (let i = shape.length - 2; i >= 0; i--) {
			arr = [];
			for (let j = 0; j < shape[i]; j++) {
				arr.push(base_arr);
			}
			base_arr = arr;
		}
		return new ndarray(shape, arr);
	}

/* -------------------------------------------------------------------------------------------------------------------------------------------- */

	/* object specific (property) methods */
	
	/* sum of 2 ndarrays */
	add(v2) {
		if (this.shape.toString() === v2.shape.toString()) {
			let sum = [];
			for (let i = 0; i < v1.flat.length; i++) {
				sum[i] = this.flat[i] + v2.flat[i];
			}
			this.arrange(sum);
		}
		else {
			return new Error("Unequal Size");
		}
	}

	/* reshapes the ndarray only if for the new shape the number of elements remain same */
	reshape(new_shape) {
		if (core.calc_size(new_shape) === this.size) {
			/* reshape */
			const temp_arr = this.flat;
			this.shape = new_shape;
			this.dim = core.find_dim(this.shape);
			this.arrange(temp_arr);
		}
		else {
			return new Error("Resizing error : can't change the size");
		}
	}

	/* changes the shape and size of the ndarray in place */
	resize(new_shape) {
		const temp_arr = this.flat;
		this.shape = new_shape;
		this.size = core.calc_size(new_shape);
		this.dim = core.find_dim(this.shape);
		this.arrange(temp_arr);
	}

	arrange(elems_arr){
		this.array = core.arrange(this.shape,elems_arr);
		this.flatten();
	}

	flatten(){
		let temp = [];
		core.flatten(this.array,temp);
		this.flat = core.form_arr(temp,this.dtype);
	}

	transpose(){
		return core.transpose(this.array,this.dtype);
	}

}

module.exports = ndarray;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/* function to find the transpose */
module.exports = function transpose(arr,dtype='uint8') {
    const calc_shape = __webpack_require__(1),
    flatten = __webpack_require__(2),
    form_arr = __webpack_require__(3),
    arrange = __webpack_require__(0),
    
    s = calc_shape(arr);
    let flat_arr = [];
    flatten(arr,flat_arr);
    let t = form_arr(flat_arr,dtype),
    r = s.length > 1 ? s[0] : 1, c = s.length > 1 ? s[1] : s[0], k=0,
    b = [];
    for(let i=0; i<c; i++){
        for(let j=i; j<t.length; j+=c){
            b[k++] = t[j];
        }
    }
    return arrange([c,r],b);
}


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function product(arr1, arr2,mode="matrix") {
	let prod = [];
	const calc_shape = __webpack_require__(1);
	const form_arr = __webpack_require__(3);
	const flatten = __webpack_require__(2);
	const arrange = __webpack_require__(0);
	if(Array.isArray(arr1) && Array.isArray(arr2)){
		let ta1 = [],
		ta2 = [];
		flatten(arr1,ta1);
		flatten(arr2,ta2);
		let t1 = form_arr(ta1),
		t2 = form_arr(ta2),
		s1 = calc_shape(arr1),
		s2 = calc_shape(arr2);
		
		if(s1.length === 2 && s2.length === 2){
			if(s1[1] === s2[0] && mode === 'matrix'){
				// prod = matrix_product(a,b);
			}
			else if(mode==='dot'){
				if(s1.toString() === s2.toString()){
					prod = product(ta1,ta2);
					return arrange(s1,prod);
				}
				else{
					throw new Error("Uneven shape");
				}
			}
		}
		else if(s1.length > 1 && s2.length === 1){
			if(mode === 'matrix'){
				if(s1[s1.length-2] === s2[0]){
					let k=0;
					for(let i=0; i<t1.length; i++){
						if((i%t2.length)===0 && i!==0) ++k;
						prod.push(t1[i]*t2[k]);
					}
					return arrange(s1,prod);
				}
				else{
					throw new Error("Uneven Size");
				}
			}
			else{
				if(s1[s1.length-1] === s2[0]){
					let k = 0;
					for(let i=0; i<t1.length; i++){
						if(k>=t2.length)k=0;
						prod.push(t1[i]*t2[k++]);
					}
					return arrange(s1,prod);
				}
				else{
					throw new Error("Uneven Size");
				}
			}
		}
		else if(s1.length === 1 && s2.length > 1){
			return product(arr2,arr1);
		}
		else if(s1.length === 1 && s2.length === 1){
			if(t1.length === t2.length){
				for(let i=0; i<t1.length; i++){
					prod.push(t1[i]*t2[i]);
				}
			}
			else{
				throw new Error("Uneven Size");
			}
		}
		else{
			if(s1.toString() === s2.toString()){
				prod = product(ta1,ta2);
				return arrange(s1,prod);
			}
			else{
				throw new Error("Uneven size");
			}
		}
	}
	else if(Array.isArray(arr1) && !Array.isArray(arr2)){
		let ta1 = [];
		flatten(arr1,ta1);
		let t1 = form_arr(ta1);
		let s1 = calc_shape(arr1);
		for(let i=0; i<t1.length; i++){
			prod.push(t1[i]*arr2);
		}
		return arrange(s1,prod);
	}
	else if(!Array.isArray(arr1) && Array.isArray(arr2)){
		return product(arr2,arr1);
	}
	return prod;
}



/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function sum(arr1, arr2) {
    const calc_shape = __webpack_require__(1);
    const arrange = __webpack_require__(0);
    const form_arr = __webpack_require__(3);
    const flatten = __webpack_require__(2);
    let summ,
    ta1 = [],
    ta2 = [],
    t1,t2,s1,s2;
    if(!arr2){
        flatten(arr1,ta1);
        t1 = form_arr(ta1);
        s1 = calc_shape(arr1);
        if(s1.length > 1){
            summ = [];
            let s = 0;
            for(let i=0; i<=t1.length; i++){
                if((i%s1[s1.length-1]) === 0 && i!== 0){ 
                    summ.push(s);
                    s = 0;
                }
                s+=t1[i];
            }
            return summ;    
        }
        else{
            summ = 0;
            for(let i=0; i<t1.length; i++){
                summ += t1[i];
            }
            return summ;
        }
    }
    else{
        flatten(arr1,ta1);
        flatten(arr2,ta2);
        t1 = form_arr(ta1);
        t2 = form_arr(ta2);
        s1 = calc_shape(arr1);
        s2 = calc_shape(arr2);
        if(s1.toString() === s2.toString()){
            summ = [];
            for(let i=0; i<t1.length; i++){
                summ[i] = t1[i]+t2[i];
            }
            let si = s1.length > 1 ? s1.slice(s1.length-2) : s1;
            return arrange(si,summ);
        }
        else{
            throw new Error("Uneven Size");
        }
    }
}

/***/ })
/******/ ]);