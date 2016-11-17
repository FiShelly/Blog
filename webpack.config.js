/**
 * Created by ddxfc on 2016/11/16.
 */
var webpack = require('webpack');

module.exports = {
    entry: './public/javascripts/controller/blog-app-controller.js',
    output: {
        path: './public/javascripts/',
        filename: 'main.js'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css'}
        ]
    }
    // plugins:[
    //     new webpack.ProvidePlugin({
    //         $:"jquery",
            // jQuery:"jquery",
            // "window.jQuery":"jquery"
        // })
    // ]
};