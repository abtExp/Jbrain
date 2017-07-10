const { ndarray, sum, product, core } = require('../node_modules/vecto');

/* weighted_input : calculates sigma(w*x) + b */

function weighted_input(w, x, b) {
    const wa = product(w, x, 'dot');
    const sigwx = sum(wa);
    let z = sum(sigwx, b);
    return 0;
}

/* cost_grad : returns gradC wrt activ */

function cost_grad(a, y) {
    for (let i = 0; i < y.length; i++) {
        y[i] = -y[i];
    }
    const gradC = sum(a, y);
    return gradC;
}

function shuffle(input, mini_batch_size, labels) {
    let batch = [],
    y = [],
    i;
    while (batch.length <= mini_batch_size) {
        i = Math.floor(Math.random() * input.length);
        batch.push(input[i]);
        y.push(labels[i]);
    }
    return [batch, y];
}



module.exports = {
    weighted_input: weighted_input,
    cost_grad: cost_grad,
    shuffle: shuffle
}
