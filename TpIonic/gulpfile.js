"use strict";
const gulp = require("gulp"),
  del = require("del"),
  fs = require("fs"),
  rename = require('gulp-rename'),
  shell = require('gulp-shell'),
  gutil = require('gulp-util'),
  ftp = require('vinyl-ftp'),
  runSequence = require('run-sequence'),
  GulpSSH = require("gulp-ssh");

var config = {
  host: 'timepuncher.ch',
  port: 22,
  username: 'tpdotnetcore',
  remotePath: '/sites/TpIonic/',
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
  gulp.src('../../../timepuncher-client-config-timepuncher.ch.ts')
    .pipe(rename('timepuncher-client-config.ts'))
    .pipe(gulp.dest('src'));
});

/**
 * Remove build directory.
 */
gulp.task('clean', (cb) => {
  return del(["www","platforms/browser"], cb);
});

/**
 * Build the browser version.
 */
gulp.task('buildbrowser', shell.task(['ionic cordova build browser']));

/**
 * Upload distribution to timepuncher.ch.
 */
gulp.task('upload', function () {
  var conn = ftp.create({
    host: config.host,
    user: config.user,
    password: config.password,
    parallel: 10,
    log: gutil.log,
    secure: true
  });

  var globs = ['platforms/browser/www/**'];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return gulp.src(globs, { base: 'platforms/browser/www', buffer: false })
    .pipe(conn.newer('/')) // only upload newer files
    .pipe(conn.dest('/'));
});

/**
 * Build and deploy to timepuncher.ch with prod config.
 */
gulp.task('deploy', (cb) => {
  runSequence('clean', 'copyConfigProd', 'buildbrowser', 'upload', cb);
});

