const { math, core } = require('vecto');

function quadCost(a, y, m) {
    console.log('from inside quadCost cost fn');
    console.log('shape of a and y');
    console.log(core.calc_shape(a));
    console.log(core.calc_shape(y));
    let diff = math.diff(a, y);
    console.log(diff);
    console.log(math.pow(diff, 2));
    return math.product((1 / (2 * m)), math.pow(math.diff(a, y), 2));
}

quadCost.grad = (a, y, m) => {
    console.log('from inside quadCost.grad');
    console.log(a);
    console.log(y);
    console.log(m);
    return math.product((1 / m), math.diff(a, y));
}

module.exports = quadCost;