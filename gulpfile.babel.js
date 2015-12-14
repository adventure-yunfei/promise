import gulp from 'gulp';
import gulpUtil from 'gulp-util';
import gulpBabel from 'gulp-babel';
import webpack from 'webpack';
import yargs from 'yargs';
import rimraf from 'rimraf';

import makeWebpackConfig from './makeWebpackConfig';
import {BUNDLE_DIR, ES6_COMPILE_DIR, SRC_DIR} from './constants';

const args = yargs
    .alias('p', 'production')
    .argv;
const isDev = !args.production;


gulp.task('clean-es6-output', () => {
    rimraf.sync(ES6_COMPILE_DIR);
});
gulp.task('compile-es6', ['clean-es6-output'], () => {
    return gulp.src(`${SRC_DIR}/**.js`)
        .pipe(gulpBabel())
        .pipe(gulp.dest(ES6_COMPILE_DIR));
});

gulp.task('clean-bundle', () => {
    const webpackConfig = makeWebpackConfig(isDev);
    for (let key in webpackConfig.entry) {
        rimraf.sync(`${BUNDLE_DIR}/${key}*`);
    }
});
// task to produce one bundled file
gulp.task('build-bundle', ['clean-bundle'], (done) => {
    webpack(makeWebpackConfig(isDev), (err, stats) => {
        var jsonStats = stats.toJson();
        var buildError = err || jsonStats.errors[0] || jsonStats.warnings[0];

        if (buildError) {
            if (isDev) {
                gulpUtil.log('[webpack]', 'Fatal build error: \n' + buildError);
            } else {
                throw new gulpUtil.PluginError(buildError);
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

gulp.task('default', ['build-bundle']);