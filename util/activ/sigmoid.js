const { math, core } = require('vecto');

function sigmoid(z) {
    let shape = core.calc_shape(z),
        z_ = core.form_arr(core.flatten(z)).map(i => -i),
        activ = math.divide(1, math.sum(1, math.exp(z_)));
    return core.arrange(shape, activ);
}

sigmoid.dash = (z) => {
    if (!Array.isArray(z)) {
        return (sigmoid(z) * (1 - (sigmoid(z))));
    } else {
        return z.map((i) => (sigmoid(i) * (1 - (sigmoid(i)))));
    }
}

module.exports = sigmoid;