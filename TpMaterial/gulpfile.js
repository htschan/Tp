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
  gulp.src('../../../timepuncher-client-config.ts')
    .pipe(gulp.dest('src/app'));
});

