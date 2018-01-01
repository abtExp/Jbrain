function binaryCrossEntropy(a, y, m) {
    // max(a, 0) - a * y + log(1 + exp(-abs(a)))

}

binaryCrossEntropy.grad = function(a, y, m) {

}

module.exports = binaryCrossEntropy;