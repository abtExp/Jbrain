var vect = require('vect_obj');
/* defines each layer's weight and biases, if two parameters are provided weights are
 * returned else biases.
 */
function lyr(neuron_count,ip_wts,fill_style=1){
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
		var wip = [];
		z.forEach((i)=>{
			wip.push((1/(1+(Math.exp(-i)))));
		});

		return wip;
	}
}

/* weighted_input : calculates sigma(w*x) + b */

function weighted_input(w,x,b){
// 	console.log(`w = ${w}`);
// 	console.log(`x = ${x}`);
// 	console.log(`b = ${b}`);
// 	console.log(product(w,x));
	var wa = vect.product(w,x);
// 	console.log(`w.x = ${wa}`);
// 	console.log(`sigma w.x = ${sum(wa)}`);
	let z =  vect.sum(sum(wa), b);
// 	console.log("! " + z);
// 	console.log(`z for ${j}th neuron is ${z}`);
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

function shuffle(input,mini_batch_size){
	//TODO
	
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