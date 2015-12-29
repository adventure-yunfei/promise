# ECMAScript 6 starter project

A starter project to embrace incoming es6 js.

# What it has?

- Babel es6 compiler to transform es6 source code to es5 code
- Webpack tuned to build one file bundle
- Auto-Produce es5 code output when using as npm package
- ESLint tuned to ensure better code style
- "__assert__" keyword to enable debug check, which is similar to java "assert"

# How to use it

1. Download the code
2. Run "npm install"
3. Run "npm install gulp -g" to install gulp globally (if you haven't installed it yet)
3. Writing your es6 code as you wish - note "src/index.js" is the bundle main file
4. When finish coding, run "gulp". It'll produce es5 output for each file under "lib/", and the bundled file under "bundles/"
5. When using as npm package, it's tuned to export compiled code under "lib/" and "bundles/". No need to manually compile es6 code
