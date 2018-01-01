const { math, core } = require('vecto');

function sigmoid(z) {
    let shape = core.calcShape(z),
        z_ = core.formArr(core.flatten(z)).map(i => -i),
        activ = math.divide(1, math.sum(1, math.exp(z_)));
    return core.arrange(shape, activ);
}

sigmoid.dash = (z) => {
    let sigma = sigmoid(z);
    return math.product(sigma, math.diff(1, sigma), 'dot');
}

module.exports = sigmoid;