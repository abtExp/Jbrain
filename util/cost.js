const quadCost = require('./costs/quadCost'),
    crossEntropy = require('./costs/crossEntropy');

const cost = {
    quadCost: quadCost,
    crossEntropy: crossEntropy
}

module.exports = cost;