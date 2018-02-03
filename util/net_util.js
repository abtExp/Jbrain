const { math, core } = require('vecto');

/**
 * 
 * @param {*} w 
 * @param {*} x 
 * @param {*} b 
 */
function weighted_input(w, x, b) {
    console.log('weighted_input');
    console.log(w);
    console.log(x);
    console.log(b);
    return math.sum(math.product(w, x, 'matrix'), b);
}

/** shuffle : Shuffles the features and labels keeping them aligned and forms mini batches
 * 
 * @input : [Number] , The features array
 * 
 * @labels : [Number] , The labels array
 * 
 * @mini_batch_size : int , The size of a minibatch
 * 
 * Returns : [Number] , The array of minibatches formed with the shuffled data
 * 
 */

function shuffle(input, labels, mini_batch_size) {
    let batches = [],
        batch = [],
        y = [],
        y_ = [],
        no_of_batches = Math.floor(input.length / mini_batch_size),
        i, j;
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

function pooling(arr, type = 'max') {

}



module.exports = {
    weighted_input: weighted_input,
    shuffle: shuffle
}