function quadCost(a, y, m) {
    const { math } = require('../../node_modules/vecto');
    y_ = y.map(i => -i);
    return math.product((1 / (2 * m)), math.pow(math.sum(a, y_), 2));
}

quadCost.grad = (a, y, m) => {
    const { math } = require('../../node_modules/vecto');
    y_ = y.map(i => -i);
    return math.product(1 / m, math.sum(a, y_));
}

module.exports = quadCost;