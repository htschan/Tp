"use strict";

const gulp = require("gulp"),
  del = require("del"),
  fs = require("fs"),
  path = require("path"),
  GulpSSH = require("gulp-ssh"),
  tsc = require("gulp-typescript"),
  yaml = require("js-yaml"),
  sourcemaps = require('gulp-sourcemaps'),
  tsProject = tsc.createProject("tsconfig.json"),
  runSequence = require('run-sequence');

var config = {
  host: 'timepuncher.ch',
  port: 22,
  username: 'tpdeploy',
  privateKey: fs.readFileSync('../../ssh.tpdeploy.private.ppk')
}

var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
});

gulp.task('transpile', () => {
  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject());
  return tsResult.js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['transpile'], () => {
  gulp.watch('src/**/*.ts', ['transpile']);
  gulp.watch('./api/swagger/swagger.yaml', ['swagger']);
});

gulp.task('default', ['watch']);

gulp.task('copyConfig', () => {
  gulp.src('../../timepuncher-variables-server.ts')
    .pipe(gulp.dest('src'));
});

gulp.task('swagger', () => {
  var doc = yaml.safeLoad(fs.readFileSync(path.join(__dirname, "./api/swagger/swagger.yaml")));
  fs.writeFileSync(path.join(__dirname, "./dist/swagger.json"), JSON.stringify(doc, null, " "));
});

/**
 * Remove build directory.
 */
gulp.task('clean', (cb) => {
  return del(["dist"], cb);
});

gulp.task("build", function (callback) {
  runSequence('clean', 'transpile', 'swagger', callback);
});

gulp.task('deploy', (cb) => {
  return gulp
    .src(['dist/**/*.*', '!**/timepuncher-variables-server.js'])
    .pipe(gulpSSH.dest('/usr/share/nginx/tpserver/'))
});
