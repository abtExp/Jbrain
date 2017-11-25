const GradientDescentOptimizer = require('./optimizers/gradientDescent'),
    AdamOptimizer = require('./optimizers/adam'),
    RMSPropOptimizer = require('./optimizers/rmsprop');

module.exports = {
    GradientDescentOptimizer,
    AdamOptimizer,
    RMSPropOptimizer
}