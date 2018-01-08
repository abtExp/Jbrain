const { math, core } = require('vecto');

function quadCost(a, y, m) {
    let cost = math.diff(a, y);
    cost = math.pow(cost, 2);
    cost = math.sum(cost, null, 1);
    cost = math.product((1 / (2 * m)), cost);
    return cost;
}

quadCost.grad = (a, y, m) => {
    return math.product((1 / m), math.sum(math.diff(a, y), null, 1));
}

module.exports = quadCost;