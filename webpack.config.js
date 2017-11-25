const path = require('path'),
    ujs = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: path.resolve(__dirname, 'Jbrain.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'build.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [new ujs()]
}