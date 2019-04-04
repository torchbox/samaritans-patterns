# samaritans-patterns

## Overview

This repository provides the pattern library code and assets for Samaritans, as used on samaritans.org.

- _project_styleguide_: this contains all template code, structured to follow Atomic Design principles. Since the samaritans.org site uses [Wagtail](https://wagtail.io/), these templates use the [Django template language](https://docs.djangoproject.com/en/2.2/ref/templates/).
    - Please note that these templates are provided for reference and cannot be used as a drop-in implementation for other Wagtail/Django sites, due to the use of custom template tags that can't included here.
- _static_src_: this contains the code for building the pattern library's CSS and Javascript, as well as static assets such as images and fonts.


## Front end tooling

This set of tooling can form the basis for any new projects using the Samaritans styles & patterns.

### What's required

The tooling makes heavy use of Node.js/npm. To install node on the host machine we recommend using [`nvm`](https://github.com/creationix/nvm). Once you have `nvm` installed simply run `nvm install` to install and activate the version of node required for the project. Refer to the [`nvm` documentation](https://github.com/creationix/nvm#usage) for more details about available commands.


### Getting started

* From inside the `static_src` directory, run `npm install`.
* This will create:
    - a set of files inside `node_modules` which should be excluded from version control
    - a `package-lock.json` file, which will record the exact version of node packages used.
* It's advisable to commit the package-lock.json file to your version control, to ensure consistency between the packages used when different developers are working on the same project
* It may be advisable to upgrade the packages to their latest versions (see Using npm below)


### What's included

* [SASS](http://sass-lang.com/) CSS with [auto-prefixing](https://github.com/postcss/autoprefixer).
* [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io) for ES2015 support with module loading.
* Consideration for images, currently copying the directory only - to avoid slowdowns and non-essential dependancies. We encourage using SVG for UI vectors and pre-optimised UI photograph assets.
* [Build commands](#build-scripts) for generating testable or deployable assets only
* Sass linting with `sass-lint`
* JS linting with `eslint`

### Developing with it

* To start the development environment, run `npm start` - to stop this process press `ctrl + c`.
* Source files for developing your project are in `static_src` and the distribution folder for the compiled assets is `static_compiled`. Don't make direct changes to the `static_compiled` directory as they will be overwritten.

Note that the build, debug and start commands will all rebuild node-sass before running the watch commands. This is because of differences between the way node-sass is installed when running vagrant up and when running `npm install` on the host machine.

#### Using npm

* Install all packages from `package.json`: `npm install`
* Add new packages that are only required for development, e.g. tooling: `npm install --save-dev package_name` (this will add it to `package.json` and `package-lock.json` too)
* Add new packages required in production, e.g. react: `npm install --save-prod package_name`
* To upgrade packages run `npm update package_name` or `npm update` to update them all.

### Deploying it

#### Build scripts

To only build assets for either development or production you can use

 * `npm run build` To build development assets
 * `npm run build:prod` To build assets with minification and vendor prefixes

#### Debug script

To test production, minified and vendor prefixed assets you can use

 * `npm run debug` To develop with a simple http server, no browsersync and production assets

### Further details of the packages included
- **autoprefixer** - adds vendor prefixes as necessary for the browsers defined in `browserslist` in the npm config https://www.npmjs.com/package/autoprefixer
- **babel-core** - transpiler for es6 / react https://www.npmjs.com/package/babel-core
- **babel-eslint** - add-on for extra linting of experimental features (may not be necessary for all projects) https://www.npmjs.com/package/babel-eslint
- **babel-loader** - use babel with webpack - https://www.npmjs.com/package/babel-loader
- **babel-preset-env** - babel preset for the latest version of es6, es2015
  etc. https://www.npmjs.com/package/babel-preset-env https://babeljs.io/env/
https://babeljs.io/docs/plugins/
- **eslint** - lint your javascript https://www.npmjs.com/package/eslint
- **node-sass** - compiles Sass to CSS https://www.npmjs.com/package/node-sass
- **npm-run-all** - run more than one npm script concurrently - used by some of our npm scripts https://www.npmjs.com/package/npm-run-all
- **onchange** - watches for changes in a set of files - used by our watch scripts https://www.npmjs.com/package/onchange
- **postcss-cli** - required by `autoprefixer` - https://www.npmjs.com/package/postcss-cli
- **postcss-custom-properties** - polyfill for CSS custom properties - https://www.npmjs.com/package/postcss-custom-properties
- **sass-lint** - Linting for Sass files - https://www.npmjs.com/package/sass-lint
- **webpack** - Bundler for js files (can do much more too) - https://www.npmjs.com/package/webpack https://webpack.js.org/concepts/
- **webpack-cli** - The webpack command calls this behind the scenese (as of webpack v 4) https://www.npmjs.com/package/webpack-cli