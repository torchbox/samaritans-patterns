const path = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const postcssCustomProperties = require('postcss-custom-properties');
const sass = require('sass');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const webpack = require('webpack');
const projectRoot = 'samaritans';

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
        'admin': './static_src/javascript/admin.js',
    },
    output: {
        path: path.resolve('./static_compiled/'),
        filename: 'js/[name].js', // based on entry name, e.g. main.js
    },
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        new CopyPlugin({
            patterns: [
                {
                    // Copy images to be referenced directly by Django to the "images" subfolder in static files.
                    // Ignore CSS background images as these are handled separately below
                    from: 'images',
                    context: path.resolve(`./${projectRoot}/static_src/`),
                    to: path.resolve(`./${projectRoot}/static_compiled/images`),
                    globOptions: {
                        ignore: ['cssBackgrounds/*'],
                    },
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        new ESLintPlugin({
            failOnError: false,
            lintDirtyModulesOnly: true,
            emitWarning: true,
        }),
        new StylelintPlugin({
            failOnError: false,
            lintDirtyModulesOnly: true,
            emitWarning: true,
            extensions: ['scss', 'vue'],
        }),
        //  Automatically remove all unused webpack assets on rebuild
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: { appendTsSuffixTo: [/\.vue$/] },
                },
            },
            {
                // this will apply to both plain `.scss` files
                // AND `<style lang="scss">` blocks in `.vue` files
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: 'vue-style-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                plugins: () => [
                                    autoprefixer(),
                                    postcssCustomProperties(),
                                    cssnano({
                                        preset: 'default',
                                    }),
                                ],
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            implementation: sass,
                            sassOptions: {
                                outputStyle: 'compressed',
                            },
                        },
                    },
                ],
            },
            {
                // sync font files referenced by the css to the fonts directory
                // the publicPath matches the path from the compiled css to the font file
                // only looks in the fonts folder so pngs in the images folder won't get put in the fonts folder
                test: /\.(woff|woff2)$/,
                include: /fonts/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: '../fonts',
                    },
                },
            },
            {
                // Handles CSS background images in the cssBackgrounds folder
                // Those less than 1024 bytes are automatically encoded in the CSS - see `_test-background-images.scss`
                // the publicPath matches the path from the compiled css to the cssBackgrounds file
                test: /\.(svg|jpg|png)$/,
                include: path.resolve(`./${projectRoot}/static_src/images/`),
                use: {
                    loader: 'url-loader',
                    options: {
                        fallback: 'file-loader',
                        name: '[name].[ext]',
                        outputPath: 'images/cssBackgrounds/',
                        publicPath: '../images/cssBackgrounds/',
                        limit: 1024,
                    },
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
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

const webpackConfig = (environment, argv) => {
    const isProduction = argv.mode === 'production';

    // Runs on gitlab during the `upload_sourcemaps` job
    // This uploads JS sourcemaps to Sentry for error debugging

    if (
        process.env.CI_JOB_STAGE === 'deploy' &&
        process.env.UPLOAD_SOURCE_MAPS === 'true'
    ) {
        options.devtool = 'source-map';
        options.plugins.push(
            new SentryWebpackPlugin({
                include: './static_compiled',
                ignoreFile: '.sentrycliignore',
                ignore: ['node_modules', 'webpack.config.js'],
                configFile: 'sentry.properties',
                urlPrefix: '~/static',
            }),
        );
    }
    options.mode = isProduction ? 'production' : 'development';

    if (!isProduction) {
        // https://webpack.js.org/configuration/stats/
        const stats = {
            // Tells stats whether to add the build date and the build time information.
            builtAt: false,
            // Add chunk information (setting this to `false` allows for a less verbose output)
            chunks: false,
            // Add the hash of the compilation
            hash: false,
            // `webpack --colors` equivalent
            colors: true,
            // Add information about the reasons why modules are included
            reasons: false,
            // Add webpack version information
            version: false,
            // Add built modules information
            modules: false,
            // Show performance hint when file size exceeds `performance.maxAssetSize`
            performance: false,
            // Add children information
            children: false,
            // Add asset Information.
            assets: false,
        };

        options.stats = stats;

        // Create JS source maps in the dev mode
        // See https://webpack.js.org/configuration/devtool/ for more options
        options.devtool = 'inline-source-map';

        // See https://webpack.js.org/configuration/dev-server/.
        options.devServer = {
            // See https://webpack.js.org/configuration/dev-server/#devserverdevmiddleware
            devMiddleware: {
                publicPath: '/static/',
                index: true,
                // Write compiled files to disk. This makes live-reload work on both port 3000 and 8000.
                writeToDisk: true,
            },
            client: {
                overlay: {
                    errors: true,
                },
            },
            host: '0.0.0.0',
            port: 3000,
            compress: true,
            hot: true,
            static: path.resolve(__dirname, 'static_compiled'),
            proxy: {
                context: () => true,
                target: 'http://localhost:8000',
            },
        };
    }
    return options;
};

module.exports = webpackConfig;
