const path = require('path'),
    ujs = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: path.resolve(__dirname, 'Jbrain.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'build.js'
    },
    // module: {
    //     loaders: [{
    //         test: /\.js$/,
    //         loader: "babel-loader",
    //         use: 'babel-loader?presets[]=es2015'
    //             // query: {
    //             //     presets: ['es2015']
    //             // }
    //     }]
    // },
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