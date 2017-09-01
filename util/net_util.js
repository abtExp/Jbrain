const { math, core } = require('../node_modules/vecto');

/* weighted_input : calculates sigma(w*x) + b */

function weighted_input(w, x, b) {
    return math.sum(math.product(w, x, 'matrix'), b);
}

/* cost_grad : returns gradC wrt activ */
// To Be Removed
function cost_grad(a, y) {
    for (let i = 0; i < y.length; i++) {
        y[i] = -y[i];
    }
    const gradC = math.sum(a, y);
    return gradC;
}

function shuffle(input, mini_batch_size, labels) {
    let batch = [],
        y = [],
        i;
    while (batch.length < mini_batch_size) {
        i = Math.floor(Math.random() * input.length);
        batch.push(input[i]);
        y.push(labels[i]);
    }
    return [batch, y];
}



module.exports = {
    weighted_input: weighted_input,
    shuffle: shuffle,
    cost_grad: cost_grad
}