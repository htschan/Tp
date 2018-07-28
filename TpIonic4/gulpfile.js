"use strict";
const gulp = require("gulp"),
  del = require("del"),
  fs = require("fs"),
  rename = require('gulp-rename'),
  shell = require('gulp-shell'),
  gutil = require('gulp-util'),
  runSequence = require('run-sequence');

gulp.task('default', ['copyConfig']);

/**
 * Copy development config into src directory.
 */
gulp.task('copyConfig', () => {
  var configFile = '../../../timepuncher-client-config.ts';
  if (fs.exists('c:/sites/configdata/timepuncher-client-config.ts'))
    configFile = 'c:/timepuncher-client-config.ts';
  gulp.src(configFile)
    .pipe(gulp.dest('src'));
});

/**
 * Copy production config into src directory.
 */
gulp.task('copyConfigProd', () => {
  var configFile = '../../../timepuncher-client-config-timepuncher.ch.ts';
  if (fs.exists('c:/sites/configdata/timepuncher-client-config-timepuncher.ch.ts'))
    configFile = 'c:/sites/configdata/timepuncher-client-config-timepuncher.ch.ts';
  gulp.src(configFile)
    .pipe(rename('timepuncher-client-config.ts'))
    .pipe(gulp.dest('src'));
});

/**
 * Remove build directory.
 */
gulp.task('clean', (cb) => {
  return del(["www", "platforms/browser"], cb);
});

/**
 * Build the browser version.
 */
gulp.task('buildbrowser', shell.task(['ionic cordova build browser']));

/**
 * Upload distribution to timepuncher.ch.
 */
gulp.task('upload', function () {

  var globs = ['platforms/browser/www/**'];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  // return gulp.src(globs, { base: 'platforms/browser/www', buffer: false })
  //   .pipe(conn.newer('/')) // only upload newer files
  //   .pipe(conn.dest('/'));
});

/**
 * Build and deploy to timepuncher.ch with prod config.
 */
gulp.task('deploy', (cb) => {
  runSequence('clean', 'copyConfigProd', 'buildbrowser', 'upload', cb);
});

