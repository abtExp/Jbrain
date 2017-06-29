module.exports = class lyr{
    constructor(ip_wts,neuron_count,neuron_type='sigmoid'){
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
        this.activ_ = activ_dash(z);
        return [a,z];
    }

    //Performs activ_dash
    activ_dash(z){
        return this.activation_fn.dash(z);
    }

    


    
}

module.exports = lyr;