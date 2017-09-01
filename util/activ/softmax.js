module.exports = function softmax(z) {
    const { math } = require('../node_modules/vecto');
    let den = math.sum(math.exp(z)),
        return math.divide(math.exp(z), den);
}