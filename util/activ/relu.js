function relu(z) {
    const { math, core } = require('vecto');
    return math.max({ ar1: 0, ar2: z });
}

relu.dash = (z) => {
    //TODO
}

module.exports = relu;