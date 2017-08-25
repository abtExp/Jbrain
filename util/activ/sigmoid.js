function sigmoid(z) {
    if (!Array.isArray(z)) {
        return (1 / 1 + (Math.exp(-z)));
    } else {
        return z.map((i) => (1 / (1 + (Math.exp(-i)))));
    }
}

sigmoid.dash = (z) => {
    if (!Array.isArray(z)) {
        return (sigmoid(z) * (1 - (sigmoid(z))));
    } else {
        return z.map((i) => (sigmoid(i) * (1 - (sigmoid(i)))));
    }
}

module.exports = sigmoid;