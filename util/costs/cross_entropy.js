const { math, core } = require('vecto');

function crossEntropy(a, y, m) {
    let cost = math.sum(math.product((-1 / m), math.sum(math.product(y, math.log(a), 'dot'),
        math.product(math.diff(1, y), math.log(math.diff(1, a)), 'dot')), 'dot'), null, 1);
    console.log(cost);
    return cost;
}

crossEntropy.grad = (y, a) => {
    let y_ = y.map(i => 1 - i),
        a_ = a.map(i => 1 - i),
        o = math.divide(y_, a_).map(i => -1 * i);
    return -(math.sum(math.divide(y, a), o));
}

module.exports = crossEntropy;