const { ndarray, sum, product, core } = require('../node_modules/vecto');

/* weighted_input : calculates sigma(w*x) + b */

function weighted_input(w, x, b) {
    const wa = product(w, x, 'dot');
    const sigwx = sum(wa);
    let z = sum(sigwx, b);// whatif bias is a single element ? 
    //As in for the output array or any hidden layer have only 1 neuron
    return z;
}

/* cost_grad : returns gradC wrt activ */

function cost_grad(a, y) {
    for (let i = 0; i < y.length; i++) {
        y[i] = -y[i];
    }
    const gradC = sum(a, y);
    return gradC;
}

/* sigma_dash : returns the sigma' for calculating the errors. */

function sigma_dash(z) {
    const sigmoid = require('./activ/sigmoid'); 
    return (sigmoid(z) * (1 - (sigmoid(z))));
}

function shuffle(input, mini_batch_size, labels) {
    let batch = [],
    y = [];
    i;
    while (batch.length <= mini_batch_size) {
        i = Math.floor(Math.random() * input.length);
        batch.push(input[i]);
        y.push(labels[i]);
    }
    return [batch, y];
}



module.exports = {
    sigma_dash: sigma_dash,
    weighted_input: weighted_input,
    cost_grad: cost_grad,
    shuffle: shuffle
}
