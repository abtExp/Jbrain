var net_util = {
    lyr : lyr,
    sigma_dash : sigma_dash,
    sigmoid_function : sigmoid_function,
    weighted_input : weighted_input,
    cost_grad : cost_grad
};


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

(()=>{
    if(module.exports){
        module.exports = net_util;
    }   
})()

export default net_util;