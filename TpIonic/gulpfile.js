"use strict";
const gulp = require("gulp"),
  del = require("del"),
  fs = require("fs"),
  rename = require('gulp-rename'),
  shell = require('gulp-shell'),
  runSequence = require('run-sequence'),
  GulpSSH = require("gulp-ssh");

var config = {
  host: 'timepuncher.ch',
  port: 22,
  username: 'tpdeploy',
  privateKey: fs.readFileSync('../../../ssh.tpdeploy.private.ppk')
}

var gulpSSHTimepuncher = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
});

gulp.task('default', ['copyConfig']);

/**
 * Copy development config into src directory.
 */
gulp.task('copyConfig', () => {
  gulp.src('../../../timepuncher-client-config.ts')
    .pipe(gulp.dest('src'));
});

/**
 * Copy production config into src directory.
 */
gulp.task('copyConfigProd', () => {
  gulp.src('../../timepuncher-client-config-timepuncher.ch.ts')
    .pipe(rename('timepuncher-client-config.ts'))
    .pipe(gulp.dest('src'));
});

/**
 * Remove build directory.
 */
gulp.task('clean', (cb) => {
  return del(["www"], cb);
});

/**
 * Build the browser version.
 */
gulp.task('buildbrowser', shell.task(['ionic build browser']));

/**
 * Upload distribution to timepuncher.ch.
 */
gulp.task('upload', (cb) => {
  return gulp
    .src(['www/**/*.*', '!**/node_modules/**'])
    .pipe(gulpSSHTimepuncher.dest('/usr/share/nginx/tpionic/'))
});

/**
 * Build and deploy to timepuncher.ch with prod config.
 */
gulp.task('deploy', (cb) => {
  runSequence('clean', 'copyConfigProd', 'buildbrowser', 'upload', cb);
});
