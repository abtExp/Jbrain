const GradientDescent = require('./optimizers/gradientDescent'),
    AdamOptimizer = require('./optimizers/adam'),
    rmsProp = require('./optimizers/remprop');

module.exports = {
    GradientDescent,
    AdamOptimizer,
    rmsProp
}