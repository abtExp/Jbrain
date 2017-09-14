var quadCost = require('./costs/quadCost');
var cross_entropy = require('./costs/cross_entropy');
var log_like = require('./costs/log_like');

var cost = {
    quadCost: quadCost,
    cross_entropy: cross_entropy,
    log_like: log_like
}

module.exports = cost;