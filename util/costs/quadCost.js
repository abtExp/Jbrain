const { math, core } = require('vecto');

function quadCost(a, y, m) {
    // console.log('from inside quadCost');
    // console.log('shape of a and y');
    // console.log(core.calc_shape(a), core.calc_shape(y));
    let cost = math.diff(a, y);
    // // console.log('shape of a-y');
    // console.log(core.calc_shape(cost));
    cost = math.pow(cost, 2);
    cost = math.sum(cost, null, 1);
    cost = math.product((1 / (2 * m)), cost);
    // console.log(core.calc_shape(cost));
    return cost;
}

quadCost.grad = (a, y, m) => {
    // console.log('from inside quadCost.grad');
    // console.log('shape of gradC');
    // console.log(core.calc_shape(math.product((1 / m), math.sum(math.diff(a, y), null, 1))));
    return math.product((1 / m), math.sum(math.diff(a, y), null, 1));
}

module.exports = quadCost;