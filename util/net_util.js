const { ndarray, sum, product, core } = require('../node_modules/vecto');
/* defines each layer's weight and biases, if two parameters are provided weights are
 * returned else biases.
 */
function lyr(neuron_count, ip_wts, fill_style = 1) {
    let v;
    if (!ip_wts) {
        if (fill_style === 1) {
            v = new ndarray([neuron_count]);
            v.arrange();
        } else {
            v = ndarray.zeroes([neuron_count]);
        }
    } else {
        if (fill_style === 1) {
            v = new ndarray([neuron_count, ip_wts]);
            v.arrange();
        } else {
            v = ndarray.zeroes([neuron_count, ip_wts]);
        }
    }
    return v;
}

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
    const batch = [],
    y = [];
    let i;
    while (batch.length <= mini_batch_size) {
        i = Math.floor(Math.random() * input.length);
        batch.push(input[i]);
        y.push(labels[i]);
    }
    return [batch, y];
}



module.exports = {
    lyr: lyr,
    sigma_dash: sigma_dash,
    weighted_input: weighted_input,
    cost_grad: cost_grad,
    shuffle: shuffle
}
