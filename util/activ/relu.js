function relu(z) {
    const { math } = require('../../node_modules/vecto');
    return math.max(0, z);
}

relu.dash = (z) => {
    //TODO
}

module.exports = relu;