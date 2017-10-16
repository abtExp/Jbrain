const { math, core } = require('vecto');

/* weighted_input : calculates sigma(w*x) + b */
// Registration Number (Electricity) :  2016019738

function weighted_input(w, x, b) {
    return math.sum(math.product(w, x, 'matrix'), b);
}

function shuffle(input, labels, mini_batch_size) {
    let batches = [],
        batch = [],
        y = [],
        y_ = [],
        no_of_batches = Math.floor(input.length / mini_batch_size),
        i, j;
    console.log(no_of_batches);
    for (i = 0; i < no_of_batches; i++) {
        while (batch.length < mini_batch_size) {
            j = Math.floor(Math.random() * input.length);
            batch.push(input[j]);
            y.push(labels[j]);
        }
        batches.push(batch);
        y_.push(y);
        batch = [];
        y = [];
    }
    return [batches, y_];
}



module.exports = {
    weighted_input: weighted_input,
    shuffle: shuffle
}