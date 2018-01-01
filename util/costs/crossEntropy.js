function binaryCrossEntropy(z, y, m) {
    // max(z, 0) - z * y + log(1 + exp(-abs(z)))

}

binaryCrossEntropy.grad = function(a, y, m) {

}

module.exports = binaryCrossEntropy;