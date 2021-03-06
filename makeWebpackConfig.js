import webpack from 'webpack';
import {ROOT, SRC_DIR, BUNDLE_DIR} from './constants';

export default function makeWebpackConfig(isDev) {
    return {
        context: ROOT,
        entry: {
            'promise.min': `${SRC_DIR}/Promise.js`
        },
        debug: isDev,
        devtool: isDev ? 'cheap-module-source-map' : '',
        watch: isDev,
        output: {
            path: BUNDLE_DIR,
            filename: '[name].js',
            sourceMapFilename: '[file].[hash].map',
            library: 'Promise',
            libraryTarget: 'var'
        },
        module: {
            loaders: [{
                exclude: [/node_modules/],
                test: /\.js$/,
                loader: 'babel'
            }]
        },
        plugins: [
            // Define a "__DEV__" variable to add code only for debug mode
            // e.g. __DEV__ && someDebugOnlyCheck();
            new webpack.DefinePlugin({
                '__DEV__': isDev
            })
        ].concat(isDev ? [] : [
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true
                }
            })
        ])
    };
}
