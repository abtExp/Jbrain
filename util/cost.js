const quadCost = require('./costs/quadCost'),
    cross_entropy = require('./costs/cross_entropy'),
    log_like = require('./costs/log_like');

const cost = {
    quadCost: quadCost,
    cross_entropy: cross_entropy,
    log_like: log_like
}

module.exports = cost;