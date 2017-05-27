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
/***/ (function(module, exports) {

/* A JS library for dealing with n-dimensional vectors. 
 * Referenced from numpy.
 * 
 * Project-Name : Ndime.
 * Code-Name : numjs.
 * Version : 0.6.
 * Author : Anubhav Tiwari <atworkstudios@gmail.com>
 */

class Vector{
	constructor(shape=[],arr=[]){
		this.array = arr;
		this.shape = ((shape.length)>0) ? shape : (this.calc_shape(this.array));
		this.size = this.calc_size(this.shape);
		this.dim = this.find_dim();
		this.flat = [];
		Vector.flatten(this.array,this.flat);
	}
	
	/* class specific (static) methods */
    /* form a new vector for the given array */
	static array(arr){
		return new Vector([],arr);
	}

    /* make a new zero Vector */
	static zeroes(shape){
		var arr;
		if(shape.length == 1){
			arr = Vector.fill(shape[0],0);
		}
		else{
			var base_arr = Vector.fill(shape[shape.length-1],0);
			for(var i=shape.length-2; i>=0; i--){
				arr = [];
				for(var j=0; j<shape[i]; j++){
					arr.push(base_arr);
				}
				base_arr = arr;
			}
		}
		return new Vector(shape,arr);
	}

   	
   /* sum of 2 vectors */
   static add(v1,v2){
	   if(v1.size === v2.size){
		   var sum = [];
		   for(var i=0; i<v1.flat.length; i++){
			   sum[i] = v1.flat[i] + v2.flat[i];
		   }
		   var v = new Vector(v1.shape);
		   v.arrange(sum);
		   return v;
	   }
	   else{
		   return new Error("Unequal Size");
	   }
   }

   /* function to convert n-dimension array into 1-D array */

	static flatten(arr,tarr){
		for(var i of arr){
			if(Array.isArray(i)){
				this.flatten(i,tarr);
			}
			else{
				tarr.push(i);
			}
	    }
	}


   /* fills the vector acc to passed args */
   static fill(len, ...args){
		var arr = [];
	  var i;
		if(!args || args.length === 0){
			for(i=0; i<len; i++){
				arr[i] = Math.random();
			}
		}
		else{
			if(args.length === 1){
				if(Array.isArray(args[0])){
					var j=0;
					for(i=0; i<len; i++){
						arr[i] = args[0][j++];
						if(j>=args[0].length){
							j=0;
						}
					}
				}
				else{
					for(i=0; i<len; i++){
						arr[i] = args[0];
					}
				}
			}
			else{
				var min;
				var num = min = args[0];
				var max = args[1];
				for(i=0; i<len; i++){
					arr[i] = num++;
					if(num>max){
						num = min;
					}
				}
			}
		}
		return arr;
	}


 /* -------------------------------------------------------------------------------------------------------------------------------------------- */   
	
	/* object specific (property) methods */

	/* find the shape of the given array */
	
	find_dim(){
		return this.shape.length;
	}
	
	calc_shape(arr){
		var shape = [];
		shape.push(arr.length);
		var a = arr[0];
		while(Array.isArray(a)){
			shape.push(a.length);
			a = a[0];
		}
		return shape;
	}

	/* find the size of the array */
	calc_size(shape){
		var size = 1;
		for(var i of shape){
			size *= i;
		}
		return size;
	}

  
	/* a method to arrange or create a Vector from the given elements */
	arrange(elems_arr){
		var dim = this.dim;
		var base_arr_size = this.shape[dim-1];
		var final_arr = [];
		var base_elems = 1, j=0;
		if(dim >= 2){
			base_elems = this.shape[dim-2]; 
		}
		for(var i=0; i<base_elems; i++){
			if(elems_arr){
				var part = [];
				for(var k=0; k<base_arr_size; k++){
					part[k] = elems_arr[j++];
					if(j>=elems_arr.length){
					j=0;
					}
				}
				final_arr.push(Vector.fill(base_arr_size,part));
			}
			else{
				final_arr.push(Vector.fill(base_arr_size));
			}		
		}
		this.array = final_arr;
		this.flat = [];
		Vector.flatten(this.array,this.flat);
	}

	/* reshapes the vector only if for the new shape the number of elements remain same */
	reshape(new_shape){
		if(this.calc_size(new_shape) === this.size){
			/* reshape */
			var temp_arr = this.flat;
			this.shape = new_shape;
			this.dim = this.find_dim();
			this.flat = [];
			this.arrange(temp_arr);
		}
		else{
			return new Error("Resizing error : can't change the size");
		}
	}
	
	/* changes the shape and size of the vector in place */
	resize(new_shape){
		var temp_arr = this.flat;
		this.shape = new_shape;
		this.size = this.calc_size(this.shape);
		this.dim = this.find_dim();
		this.flat = [];
		this.arrange(temp_arr);
	}

	/* function to find the transpose */
	transpose(){
		/* converts row <-> columns */
		/* not that useful to main project as of now */
	}

	/* more to come */
}


/* some generic array methods */

/* product : test cases : 
^ *1 [a,b,c] * [x,y,z]  // equal length 1-d arrays
*2 [a,b,c] * [x,y]  // unequal length, must result in an uneven size error
*3 [a,b,c] * [x] || [a,b,c] * x  // if length of arg2 is 1 or if arg2 is scalar
*4 [[a,b,c],[d,e,f],[g,h,i]] * [a,b]  //arg1 is n-d but len(arg1) !== len(arg2), uneven size err
^ *5 [[a,b,c],[d,e,f]] * [x,y,z]  // len(arg1) !== len(arg2) but len(arg1[i]) == len(arg2), must multiply arg2 with each arg[i]
^ *6 a * x || [a] * [x]  // return a*x
*/
function product(arr1,arr2){
	var prod = [];
	if(!Array.isArray(arr1) && !Array.isArray(arr2)){  
		return arr1*arr2;
	}
	else{
		if(Array.isArray(arr1) && !Array.isArray(arr2)){  
			arr1.forEach((i)=>{
				if(Array.isArray(i)){  
					prod.push(product(i,arr2));   
				}
				else{
					prod.push(i*arr2);
				}
			});
		}
		else if(!Array.isArray(arr1) && Array.isArray(arr2)){
			return product(arr2,arr1);
		}
		else{
			if(Array.isArray(arr1[0]) && !Array.isArray(arr2[0])){  //checking if arg1 is n-d and arg2 is 1-d
				if(arr1[0].length === arr2.length){
					arr1.forEach((j)=>{
						prod.push(product(j,arr2));
					})
				}
				else{
					if(arr1.length === arr2.length){
						var i = 0;
						arr1.forEach((j)=>{
							prod.push(product(j,arr2[i++]));
						})
					}
					else{
						throw new Error("Uneven size!");
					}
				}
			}
			else{
				if(Array.isArray(arr1[0] && Array.isArray(arr2[0]))){
					if(arr1.length === arr2.length){
						for(var i=0; i<arr1.length; i++){
							prod.push(product(arr1[i],arr2[i]));
						}
					}
					else{
						throw new Error("Uneven Size");
					}
				}
				else{
					if(arr1.length === arr2.length){
						for(var i=0; i<arr1.length; i++){
							prod.push(arr1[i]*arr2[i]);
						}
					}
					else{
						throw new Error("Uneven Size");
					}
				}
			}
		}
	}
	return prod;
}

function sum(arr1,arr2){
	var i=0;
	var summ;
	if(!Array.isArray(arr1) && !Array.isArray(arr2)){
		return (arr1+arr2);
	}
		if(!arr2){
			if(Array.isArray(arr1[i])){
				summ = [];
				arr1.forEach((j)=>{
					if(Array.isArray(j)){
						summ.push(sum(j));
					}
				});
			}
			else{
					summ = 0;
					arr1.forEach((j)=>{
						summ += j;
					});
				}
			}
		else{
			if(arr1.length === arr2.length){
				summ = [];
				for(i=0; i<arr1.length; i++){
					summ[i] = arr1[i] + arr2[i];
				}
			}
			else{
				throw new Error("Uneven Size!");
			}
		}
		return summ;
	}


module.exports =  {
	sum : sum,
	product : product,
	Vector : Vector
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// import Network from 'Network';
// import svm from 'SVM';
// import naive_bayes from 'nb';
// import conv_net from 'convnet';

Network = __webpack_require__(2);
// svm = require('./brain/svm');
// naive_bayes = require('./brain/nb');
// conv_net = require('./brain/convnet');

var Jbrain = {
    Network : Network,
    // SVM : svm,
    // nb : naive_bayes,
    // conv_net : conv_net
};

module.exports = Jbrain;

// export default Jbrain;


/***/ }),
/* 2 */
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

var net_util = __webpack_require__(11);
var cost = __webpack_require__(7);
var activ = __webpack_require__(4);
var vect = __webpack_require__(0);


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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var Jbrain = __webpack_require__(1);

var net = new Jbrain.Network([3,2,1]);

var train_features = [[1,2,3],[4,2,0],[0,0,0]];
var train_labels = [0,1,0];

net.fit({train_features,train_labels, epoch: 4});

var predict = net.predict([2,1,0]);
console.log(predict);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var sigmoid = __webpack_require__(5);
var softmax = __webpack_require__(6);

var activ = {
    sigmoid : sigmoid,
    softmax : softmax
}

module.exports = activ;

/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, exports) {

module.exports = function(){
    //TODO
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var quad_cost = __webpack_require__(10);
var cross_entropy = __webpack_require__(8);
var log_like = __webpack_require__(9);

var cost = {
    quad_cost : quad_cost,
    cross_entropy : cross_entropy,
    log_like : log_like
}

module.exports = cost;

/***/ }),
/* 8 */
/***/ (function(module, exports) {



/***/ }),
/* 9 */
/***/ (function(module, exports) {



/***/ }),
/* 10 */
/***/ (function(module, exports) {



/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var vect = __webpack_require__(0);
/* defines each layer's weight and biases, if two parameters are provided weights are
 * returned else biases.
 */
function lyr(neuron_count,ip_wts, fill_style = 1){
	var v;
	if(!ip_wts){
		if(fill_style === 1){
			v = new vect.Vector([neuron_count]);
			v.array = vect.Vector.fill(neuron_count);
		}
		else{
			v = vect.Vector.zeroes([neuron_count]);
		}
	}
	else{
		if(fill_style === 1){
			v = new vect.Vector([neuron_count,ip_wts]);
			v.arrange();
		}
		else{
			v = vect.Vector.zeroes([neuron_count,ip_wts]);
		}
	}
	return v;
}
	

/* sigmoid_function : performs the sigmoid activation function */

function sigmoid_function(z){
	if(!Array.isArray(z)){
		return (1/1+(Math.exp(-z)));
	}
	else{
		var wip = z.map((i)=>{
			return (1/(1+(Math.exp(-i))));
		});

		return wip;
	}
}

/* weighted_input : calculates sigma(w*x) + b */

function weighted_input(w,x,b){
	var wa = vect.product(w,x);
	var flb = [];
	vect.Vector.flatten(b,flb);
	let z =  vect.sum(vect.sum(wa), flb);
	return z;
}

/* cost_grad : returns gradC wrt activ */

function cost_grad(a,y){
	for(var i=0; i<y.length; i++){
		y[i] = -y[i];
	}
	var gradC = vect.sum(a,y);
	return gradC;
}

/* sigma_dash : returns the sigma' for calculating the errors. */

function sigma_dash(z){
	return (sigmoid_function(z)*(1-(sigmoid_function(z))));
}

function shuffle(input,mini_batch_size,labels){
	var batch = [], y = [];
	var i;
	while(batch.length<=mini_batch_size){
		i = Math.floor(Math.random()*input.length);
		batch.push(input[i]);
		y.push(labels[i]);
	}	
	return [batch,y];
}

var net_util = {
    lyr : lyr,
    sigma_dash : sigma_dash,
    sigmoid_function : sigmoid_function,
    weighted_input : weighted_input,
    cost_grad : cost_grad,
	shuffle : shuffle
};


module.exports = net_util;

// export default net_util;

/***/ })
/******/ ]);