const { ndarray } = require('../node_modules/vecto');
const activ = require('./activ');
const { sigma_dash,sigmoid_function,
		weighted_input,cost_grad,shuffle } = require('../util/net_util');

class lyr{
    constructor(ip_wts,neuron_count,neuron_type){
        this.neurons = neuron_count;
        this.weights = new ndarray([ip_wts,neuron_count]);
        this.biases = new ndarray([neuron_count]);
        this.activation_fn = activ.neuron_type;
        this.weights.arrange();
        this.biases.arrange();
    }

    // Calculates activation for this layer
    fire(x){
        let z = weighted_input(this.weights.array,x,this.biases.array),
        a = this.activation_fn(z);
        return [a,z];
    }




    
}

module.exports = lyr;