function tanh(z) {
    const { math, core } = require('../../node_modules/vecto');
    let z_ = z.map(i => -i),
        num = math.sum(math.exp(z), math.exp(z_).map(i => -i)),
        den = math.sum(math.exp(z), math.exp(z_));
    return math.divide(num, den);
}

tanh.dash = (z) => {
    //TODO
}

module.exports = tanh;