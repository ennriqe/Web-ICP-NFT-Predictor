const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const NodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development',
    target: 'web',
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
    // Exclude node_modules from the bundle
    // externals: [NodeExternals()],
};
