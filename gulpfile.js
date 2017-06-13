const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

gulp.task('index', function index() {
  return gulp.src(['./src/index.js', './src/cli.js'])
    .pipe(babel({
      presets: ['es2015', 'es2017']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});

gulp.task('lib', function lib() {
  return gulp.src(['./src/*.js', '!./src/index.js'])
    .pipe(babel({
      presets: ['es2015', 'es2017']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./lib'));
});

gulp.task('demo', function demo() {
  return gulp.src('./demo/colors.scss')
    .pipe(sass({
      style: 'expanded',
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./demo'));
});

gulp.task('default', ['index', 'lib']);
