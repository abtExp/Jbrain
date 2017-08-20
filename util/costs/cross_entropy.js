function crossEntropy(y, a) {
    const { sum, core, product, log } = require('../../node_modules/vecto');
    let cost = 0;
    cost += (-1 / m) * (sum(product(y, log(a), product(sum(1, -y), log(sum(1, -a)))))); // something like this
    return cost;
}

crossEntropy.grad = (y, a) => {
    return -(sum(divide(y, a), -(divide(sum(1, -y), sum(1, -a))))); // something like this....
}