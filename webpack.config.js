
const path = require('path');

module.exports = {

    target: 'web',
    mode: 'development',
    devtool: 'source-map',

    entry: {
        bundle: path.resolve(__dirname, './src/tsx/main.tsx'),
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist/webpack'),
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                loaders: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },

    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    name: 'vendor',
                    enforce: true,
                    chunks: 'all'
                }
            }
        }
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.less']
    }
    
}
