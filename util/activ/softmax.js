const { math } = require('vecto');

function softmax(z) {
    let den = math.sum(math.exp(z));
    return math.divide(math.exp(z), den);
}

softmax.dash = (z) => {
    //TODO
}

module.exports = softmax;