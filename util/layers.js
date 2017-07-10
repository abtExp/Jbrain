module.exports = class lyr{
    constructor(neuron_count,ip_wts,neuron_type='sigmoid',dtype='float32'){
        const { ndarray } = require('../node_modules/vecto');

        this.neurons = neuron_count;
        this.weights = new ndarray([neuron_count,ip_wts],[],dtype);
        this.biases = new ndarray([neuron_count],[],dtype);
        this.activation_fn = set_activation(neuron_type);
        this.weights.arrange();
        this.biases.arrange();
    }

    // Calculates activation for this layer
    fire(x){
        const { weighted_input } = require('../util/net_util');
        // console.log(this.weights.array);
        // console.log(x);
        // console.log(this.biases.array);
        let z = weighted_input(this.weights.array,x,this.biases.array),
        a = this.activation_fn(z);
        console.log(z);
        console.log(a);
        this.activ_ = this.activ_dash(z);
        return [a,z];
    }

    //Performs activ_dash
    activ_dash(z){
        return this.activation_fn.dash(z);
    }

}

function set_activation(afunc){
    const activ = require('./activ');

    switch(afunc){
        case 'sigmoid' :
        return activ.sigmoid;
        
        case 'softmax' : 
        return activ.softmax;

        // case 'relu' :
        // return activ.relu;

        default :
        return null;
    }
}
