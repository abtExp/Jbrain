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
		this.flatten(this.array);
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
	   if(v1.shape === v2.shape){
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

	/* function to convert n-dimension array into 1-D array */

	flatten(arr){
		for(var i of arr){
			if(Array.isArray(i)){
				this.flatten(i);
			}
			else{
				this.flat.push(i);
			}
	    }
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
		this.flatten(this.array);
	}

	/* reshapes the vector only if for the new shape the number of elements remain same */
	reshape(new_shape){
		if(this.calc_size(new_shape) === this.size){
			/* reshape */
			var temp_arr = this.flat;
			this.shape = new_shape;
			this.dim = this.find_dim();
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
function product(arr1,arr2){
	console.log(`arg1 = ${arr1}, arg2 = ${arr2}`);
	var i;
	var prod;
	if(Array.isArray(arr2)){
		var j=0;
		if(arr1.length === arr2.length){
			prod = [];
			arr1.forEach((i)=>{
				if(Array.isArray(i)){
					prod.push(product(i,arr2[j++]));
				}
				else{
					prod.push(i*arr2[j++]);
				}
			});
		}
		else{
			throw new Error("Uneven size!");
		}
	}
	else{
		prod = [];
		arr1.forEach((i)=>{
			if(Array.isArray(i)){
				prod.push(product(i,arr2));
			}
			else{
				prod.push(i*arr2);
			}
		})
	}

	console.log(`product = ${prod}`);
	return prod;
}

function sum(arr1,arr2){
	var i;
	var sum;
	if(arr2){
		if(Array.isArray(arr2)){
			if(arr1.length === arr2.length){
				sum = [];
				for(i=0; i<arr1.length; i++){
					sum[i] = arr1[i] + arr2[i];
				}
				return sum;
			}
			else{
				throw new Error("Uneven size!");
			}
		}
		else{
			sum = [];
			for(i=0; i<arr1.length; i++){
				sum[i] = arr1[i]+arr2;
			}
			return sum;
		}
	}
	else{
		sum = 0;
		for(i=0; i<arr1.length; i++){
			sum += arr1[i];
		}
		return sum;
	}
}

// export default Vector





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

// import Vector from 'Vector';
// import net_util from 'net_util';


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
			this.weights.push(lyr(this.net_config[i],this.net_config[i-1]));
			this.biases.push(lyr(this.net_config[i]));
		}
	}

	/* fit : method to optimise weights and biases by passing in the training_Data */

	fit(train_features, train_labels, neta=0.5, epoch=400, m=10/*, cost=cross_entropy*/){
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
				part_act.push(sigmoid_function(z_min[j] = weighted_input(this.weights[i-1],activation[i-1],this.biases[i-1],j)));
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
				var delW_B = this.backprop(i);
        i++;
				if(i>=this.input.length){
					i =0;
				}
				var delw = delW_B[0], delb = delW_B[1];
				/* updation of weights and biases by Stochastic Gradient Descent */
				console.log(`delw after backprop = ${delw[0].array}`);

				for(var nl=1; nl<this.lyrs_count; nl++){
					console.log(`delw just before sgd = ${delw[nl-1].array}`);
					console.log(`delw.flat = ${delw[nl-1].flat}`);
					console.log(`neta/m = ${-(neta/m)}`);
					console.log(`product with neta/m =  ${product(delw[nl-1].flat,(-neta/m))}`);
					delw[nl-1].arrange(product(delw[nl-1].flat,(-(neta/m))));
					console.log(`delw just after sgd = ${delw[nl-1].array}`);
					delb[nl-1].arrange(product(delb[nl-1].flat,(-(neta/m))));
				}

				console.log(`delw after SGD = ${delw[0].array}`);

				/* updating the weights */
				for(var l=1; l<this.lyrs_count; l++){
					console.log(`delw = ${delw[l-1].array}`);
					console.log(`delw.shape = ${delw[l-1].shape} , w.shape = ${this.weights[l-1].shape}`);
					this.weights[l-1].arrange(Vector.add(this.weights[l-1],delw[l-1]));
					this.biases[l-1].arrange(Vector.add(this.biases[l-1],delb[l-1]));
					console.log(`weights after update = ${this.weights[l-1].array}`);
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
			nw.push(Vector.zeroes(this.weights[i-1].shape));
			nb.push(Vector.zeroes(this.biases[i-1].shape));
		}

		/* calculating the error in the output layer */
		let del = [];
		let sig_ = [];
		this.Z[ip_num][this.lyrs_count-2].forEach((i)=>{sig_.push(sigma_dash(i));});
		/* this.Z[ip_num][this.lyrs_count-1] was undefined because we're just storing lyrs_count - 1 lyrs in Z as the input lyr
		doesn't have weights and biases */
		var gradC = cost_grad.call(this,this.activations[ip_num][this.lyrs_count-1],this.labels[ip_num]);
		let opdel = product(sig_,gradC);
		del[this.lyrs_count-1] = opdel;
		/* backpropagating */
		for(let i = this.lyrs_count-2; i>=1; i--){
			var ele = del[i+1];
			if(del[i+1].length == 1){
				ele = del[i+1][0];
			}
			var partErr = product(this.weights[i-1].array,ele);
			console.log(`weights for layer ${i} = ${this.weights[i-1].array}`);
			console.log(`delta for l+1 layer = ${ele}`);
			console.log(`w(l+1).del(l+1) = ${partErr}`);
			let err = product(partErr,this.Z[ip_num][i-1]);
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
			  nw[i-1].array[j] = (product(this.activations[ip_num][i-1],del[i][j]));
			  nb[i-1].array[j] = del[i][j];
		}
	}
		delW_B[0] = nw;
		delW_B[1] = nb;
		return delW_B;
	}

	predict(test_features){
		var res = this.feed_forward(test_features,0);
		return res[this.lyrs_count-1];
	}

}

/* defines each layer's weight and biases, if two parameters are provided weights are
 * returned else biases.
 */
function lyr(neuron_count,ip_wts,fill_style=1){
	var v;
	if(!ip_wts){
		if(fill_style === 1){
			v = new Vector([neuron_count]);
			v.array = Vector.fill(neuron_count);
		}
		else{
			v = Vector.zeroes([neuron_count]);
		}
	}
	else{
		if(fill_style === 1){
			v = new Vector([neuron_count,ip_wts]);
			v.arrange();
		}
		else{
			v = Vector.zeroes([neuron_count,ip_wts]);
		}
	}
	return v;
}


/* sigmoid_function : performs the sigmoid activation function */

function sigmoid_function(z){
	return (1/1+(Math.exp(-z)));
}

/* weighted_input : calculates sigma(w*x) + b */

function weighted_input(w,x,b,j){
	let z =  sum(product(w.array[j],x)) + b.array[j];
	console.log(`z for ${j}th neuron is ${z}`);
	return z;
}

/* cost_grad : returns gradC wrt activ */

function cost_grad(a,y){
	for(var i=0; i<y.length; i++){
		y[i] = -y[i];
	}
	var gradC = sum(a,y);
	return gradC;
}

/* sigma_dash : returns the sigma' for calculating the errors. */

function sigma_dash(z){
	return (sigmoid_function(z)*(1-(sigmoid_function(z))));
}

// (()=>{
// 	if(module){
// 		module.exports = Network;
// 	}
// })();

//testing

var test_net = new Network([3,2,1]);
var train_features = [[10,24,5],[15,20,6],[1,2,3]];
var train_labels = [1,0,0];
test_net.fit(train_features,train_labels,0.5,10,2);
/* default cost = cross-entropy */
var pred = test_net.predict([10,8,2]);
console.log(pred);
