const InputLayer = require('./layers/InputLayer'),
    ConnectedLayer = require('./layers/ConnectedLayer'),
    ConvLayer = require('./layers/ConvLayer'),
    PoolLayer = require('./layers/PoolLayer'),
    DropoutLayer = require('./layers/DropoutLayer'),
    RecurrentLayer = require('./layers/RecurrentLayer');

module.exports = {
    ConnectedLayer,
    InputLayer,
    ConvLayer,
    PoolLayer,
    DropoutLayer,
    RecurrentLayer
}