module.exports = class lyr{
    constructor(ip_wts,neuron_count,neuron_type='sigoid'){
        const activ = require('./activ'),
        { ndarray } = require('../node_modules/vecto');

        this.neurons = neuron_count;
        this.weights = new ndarray([ip_wts,neuron_count]);
        this.biases = new ndarray([neuron_count]);
        this.activation_fn = activ.neuron_type;
        this.weights.arrange();
        this.biases.arrange();
    }

    // Calculates activation for this layer
    fire(x){
        const { weighted_input } = require('../util/net_util');

        let z = weighted_input(this.weights.array,x,this.biases.array),
        a = this.activation_fn(z);
        return [a,z];
    }




    
}

module.exports = lyr;