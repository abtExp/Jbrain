const path = require('path'),
    ujs = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: path.resolve(__dirname, 'Jbrain.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'build.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: [/node_modules/, /build/],
            loader: "babel-loader"
        }]
    },
    plugins: [new ujs()]
};