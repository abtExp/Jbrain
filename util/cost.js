const quadCost = require('./costs/quadCost'),
    crossEntropy = require('./costs/crossEntropy'),
    categoricalCrossEntropy = require('./costs/categoricalCrossEntropy');

const cost = {
    quadCost,
    crossEntropy,
    categoricalCrossEntropy
}

module.exports = cost;