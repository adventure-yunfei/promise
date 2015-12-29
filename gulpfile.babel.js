import gulp from 'gulp';
import gulpUtil from 'gulp-util';
import gulpBabel from 'gulp-babel';
import webpack from 'webpack';
import yargs from 'yargs';
import rimraf from 'rimraf';
import eslint from 'gulp-eslint';

import makeWebpackConfig from './makeWebpackConfig';
import {BUNDLE_DIR, ES6_COMPILE_DIR, SRC_DIR} from './constants';

const args = yargs
    .alias('d', 'debug')
    .argv;
const isDev = args.debug; // Debug mode, will produce uncompressed debug bundle, and watch src file changes

/////////////////////////////////////
// task for code style
gulp.task('eslint', () => {
    return gulp.src(['**/*.js', '!node_modules/**', `!${BUNDLE_DIR}/**`, `!${ES6_COMPILE_DIR}/**`])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/////////////////////////////////////
// tasks to compile es6 to es5 code
gulp.task('clean-es6-output', () => {
    rimraf.sync(`${ES6_COMPILE_DIR}/*`);
});
gulp.task('compile-es6', () => {
    return gulp.src(`${SRC_DIR}/**/*.js`)
        .pipe(gulpBabel())
        .pipe(gulp.dest(ES6_COMPILE_DIR));
});
gulp.task('watch-compile-es6', () => {
    return gulp.watch(`${SRC_DIR}/**/*.js`, ['compile-es6']);
});


/////////////////////////////////////
// tasks to produce one bundled file
gulp.task('clean-bundle', () => {
    const webpackConfig = makeWebpackConfig(isDev);
    for (let key in webpackConfig.entry) {
        rimraf.sync(`${BUNDLE_DIR}/${key}*`);
    }
});
gulp.task('build-bundle', ['clean-bundle'], (done) => {
    webpack(makeWebpackConfig(isDev), (err, stats) => {
        var jsonStats = stats.toJson();
        var buildError = err || jsonStats.errors[0] || jsonStats.warnings[0];

        if (buildError) {
            if (isDev) {
                gulpUtil.log('[webpack]', 'Fatal build error: \n' + buildError);
            } else {
                throw new gulpUtil.PluginError('webpack', buildError);
            }
        } else {
            if (isDev) {
                gulpUtil.log('[webpack]', 'Bundles built successfully on debug mode');
            } else {
                gulpUtil.log('[webpack]', stats.toString({
                    colors: true,
                    version: false,
                    hash: false,
                    timings: false,
                    chunks: false,
                    chunkModules: false
                }));
            }

            // On Development mode webpack is configured to keep watching, so we don't finish the task;
            // On Production mode do only once compilation instead
            if (isDev) {
                gulpUtil.log('Continue to watch file changes...');
            } else {
                done();
            }
        }
    });
});

gulp.task('default', ['build-bundle', 'clean-es6-output', (isDev ? 'watch-compile-es6' : 'compile-es6')]);
