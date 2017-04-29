var quad_cost = require('costs/quad_cost');
var cross_entropy = require('costs/cross_entropy');
var log_like = require('costs/log_like');

var cost = {
    quad_cost : quad_cost,
    cross_entropy : cross_entropy,
    log_like : log_like
}

module.exports = cost;