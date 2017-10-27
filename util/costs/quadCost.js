const { math } = require('vecto');

function quadCost(a, y, m) {
    return math.product((1 / (2 * m)), math.pow(math.diff(a, y), 2));
}

quadCost.grad = (a, y, m) => {
    return math.product((1 / m), math.diff(a, y));
}

module.exports = quadCost;