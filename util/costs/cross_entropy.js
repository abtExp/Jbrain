function crossEntropy(a, y, m) {
    const { math } = require('vecto');
    let cost = 0,
        y_ = y.map(i => 1 - i),
        a_ = a.map(i => 1 - i);
    cost += (-1 / m) * (math.sum(math.product(y, math.log(a), 'dot'), math.product(y_, math.log(a_), 'dot')));
    return cost;
}

crossEntropy.grad = (y, a) => {
    let y_ = y.map(i => 1 - i),
        a_ = a.map(i => 1 - i),
        o = math.divide(y_, a_).map(i => -1 * i);
    return -(math.sum(math.divide(y, a), o));
}

module.exports = crossEntropy;