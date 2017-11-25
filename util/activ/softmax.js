function softmax(z) {
    const { math } = require('vecto');
    let den = math.sum(math.exp(z));
    return math.divide(math.exp(z), den);
}

softmax.dash = (z) => {
    //TODO
}

module.exports = softmax;