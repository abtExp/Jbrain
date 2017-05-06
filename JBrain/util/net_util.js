var vect = require('./vector_js');
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
		var wip = z.map((i)=>{
			return (1/(1+(Math.exp(-i))));
		});

		return wip;
	}
}

/* weighted_input : calculates sigma(w*x) + b */

function weighted_input(w,x,b){
	var wa = vect.product(w,x);
	let z =  vect.sum(vect.sum(wa), b);
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