const { math, core } = require('../node_modules/vecto');

/* weighted_input : calculates sigma(w*x) + b */

function weighted_input(w, x, b) {
    return math.sum(math.product(w, x, 'matrix'), b);
}

function shuffle(input, labels, mini_batch_size) {
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