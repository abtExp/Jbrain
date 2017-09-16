const sigmoid = require('./activ/sigmoid'),
    tanh = require('./activ/tanh'),
    relu = require('./activ/relu'),
    softmax = require('./activ/softmax');


const activ = {
    sigmoid: sigmoid,
    softmax: softmax,
    tanh: tanh,
    relu: relu
}

module.exports = activ;