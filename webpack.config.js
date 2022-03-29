const path = require('path');
const webpack = require('webpack');

const options = {
    entry: {
        'website': './static_src/javascript/main-website.js',
        'donate': './static_src/javascript/donate-website.js',
        'payments': './static_src/javascript/payments-website.js',
        'payments_monthly':
            './static_src/javascript/payments-monthly-website.js',
        'loqate': './static_src/javascript/loqate.js',
        'event': './static_src/javascript/event-website.js',
        'chat-utils': [
            'url-polyfill',
            './static_src/javascript/chat-utils.js',
        ],
    },
    output: {
        path: path.resolve('./static_compiled/js/'),
        filename: '[name].js', // based on entry name, e.g. main.js
    },
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/, /moment-timezone$/),
    ],
    module: {
        rules: [
            {
                // tells webpack how to handle js files
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    // externals are loaded via base.html and not included in the webpack bundle.
    externals: {
        //gettext: 'gettext',
    },
};

/*
  If a project requires internationalisation, then include `gettext` in base.html
    via the Django JSi18n helper, and uncomment it from the 'externals' object above.
*/

if (process.env.NODE_ENV === 'development') {
    // Create JS source maps in the dev mode
    // See https://webpack.js.org/configuration/devtool/ for more options
    options['devtool'] = 'inline-source-map';
}

module.exports = options;
