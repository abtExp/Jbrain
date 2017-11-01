const { math, core } = require('vecto');

function quadCost(a, y, m) {
    console.log('from inside quadCost');
    console.log('a and y');
    console.log(a);
    console.log(y);
    console.log('a-y');
    let cost = math.diff(a, y);
    console.log(cost);
    console.log('a-y^2');
    cost = math.pow(cost, 2);
    console.log(cost);
    console.log('sig(a-y)^2');
    cost = math.sum(cost, null, 1);
    console.log(cost);
    console.log('cost');
    cost = math.product((1 / (2 * m)), cost);
    console.log(cost);
    return cost;
}

quadCost.grad = (a, y, m) => {
    console.log('from inside quadCost.grad');
    console.log('a and y');
    console.log(a, y);
    console.log(math.diff(a, y));
    console.log(math.sum(math.diff(a, y), null, 1));
    return math.product((1 / m), math.sum(math.diff(a, y), null, 1));
}

module.exports = quadCost;