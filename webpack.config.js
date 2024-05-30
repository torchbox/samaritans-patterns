const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sass = require('sass');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const { IgnorePlugin } = require('webpack');
const { GenerateSW } = require('workbox-webpack-plugin');

const projectRoot = 'samaritans';

const options = {
    entry: {
        'website': './static_src/javascript/main-website.js',
        'donate': './static_src/javascript/donate-website.js',
        'payments': './static_src/javascript/payments-website.js',
        'payments_events':
            './static_src/javascript/payments-events-website.js',
        'payments_monthly':
            './static_src/javascript/payments-monthly-website.js',
        'loqate': './static_src/javascript/loqate.js',
        'event': './static_src/javascript/event-website.js',
        'chat-utils': [
            'url-polyfill',
            './static_src/javascript/chat-utils.js',
        ],
        'admin': './static_src/javascript/admin.js',
        'webchat': './static_src/typescript/webchat.tsx',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        // Keep alias in sync with tsconfig.json
        alias: {
            components: path.resolve(
                __dirname,
                'static_src/typescript/components',
            ),
            styles: path.resolve(
                __dirname,
                'static_src/typescript/styles',
            ),
            utils: path.resolve(
                __dirname,
                'static_src/typescript/utils',
            ),
            assets: path.resolve(
                __dirname,
                'static_src/typescript/webchat-assets',
            ),
        },
    },
    output: {
        path: path.resolve(`./${projectRoot}/static_compiled/`),
        // based on entry name, e.g. main.js
        filename: 'js/[name].js', // based on entry name, e.g. main.js
    },
    plugins: [
        new IgnorePlugin({
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
                {
                    // Copy webchat-assets
                    from: 'typescript/webchat-assets',
                    context: path.resolve(`./${projectRoot}/static_src/`),
                    to: path.resolve(
                        `./${projectRoot}/static_compiled/webchat-assets`,
                    ),
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
            extensions: ['scss'],
        }),
        new GenerateSW({
            exclude: [/.*/], // Do not precache anything
            runtimeCaching: [
                {
                    urlPattern: /static\/webchat-assets/,
                    handler: 'StaleWhileRevalidate',
                },
            ],
            swDest: 'webchat-sw.js',
        }),
        //  Automatically remove all unused webpack assets on rebuild
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: { compilerOptions: { noEmit: false } },
                },
            },
            {
                test: /\.(scss|css)$/,
                use: [
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
                                plugins: [
                                    'tailwindcss',
                                    'autoprefixer',
                                    'postcss-custom-properties',
                                    ['cssnano', { preset: 'default' }],
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
                // only looks in the fonts folder so pngs in the images folder won't get put in the fonts folder
                test: /\.(woff|woff2)$/,
                include: /fonts/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]',
                },
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            exportType: 'named',
                        },
                    },
                ],
                issuer: /\.(js|jsx|ts|tsx)$/,
            },
            {
                // Handles CSS background images in the cssBackgrounds folder
                // Those less than 1024 bytes are automatically encoded in the CSS - see `_test-background-images.scss`
                // the publicPath matches the path from the compiled css to the cssBackgrounds file
                test: /\.(svg|jpg|png)$/,
                include: path.resolve(`./${projectRoot}/static_src/images/`),
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 1024,
                    },
                },
                generator: {
                    filename: 'images/cssBackgrounds/[name][ext]',
                },
            },
        ],
    },
    // externals are loaded via base.html and not included in the webpack bundle.
    externals: {
        // gettext: 'gettext',
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
            // Enable gzip compression for everything served.
            compress: true,
            static: false,
            host: '0.0.0.0',
            // When set to 'auto' this option always allows localhost, host, and client.webSocketURL.hostname
            allowedHosts: 'auto',
            port: 3000,
            proxy: {
                context: () => true,
                target: 'http://localhost:8000',
            },
            client: {
                // Shows a full-screen overlay in the browser when there are compiler errors.
                overlay: true,
                logging: 'error',
            },
            devMiddleware: {
                index: true,
                publicPath: '/static/',
                writeToDisk: true,
                stats,
            },
            setupMiddlewares: (middlewares, devServer) => {
                // Add a header to the dev server to allow the webchat
                // service worker to be registered from the root of the dev
                // server
                devServer.app.use((req, res, next) => {
                    if (req.url.endsWith('/webchat-sw.js')) {
                        res.setHeader('Service-Worker-Allowed', '/');
                    }
                    next();
                });
                return middlewares;
            },
        };
    }

    return options;
};

module.exports = webpackConfig;
