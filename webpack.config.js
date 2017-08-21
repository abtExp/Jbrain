const path = require('path');
const dash = require('webpack-dashboard/plugin');
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
    plugins: [new dash()]
};