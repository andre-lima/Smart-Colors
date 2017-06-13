const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

gulp.task('index', function () {
  return gulp.src(['./src/index.js', './src/cli.js'])
    .pipe(babel({
      presets: ['es2015', 'es2017']
    }))
    // .pipe(uglify())
    .pipe(gulp.dest('./'));
});

gulp.task('lib', function lib() {
  return gulp.src('./src/*.js')
    .pipe(babel({
      presets: ['es2015', 'es2017']
    }))
    // .pipe(uglify())
    .pipe(gulp.dest('./lib'));
});

gulp.task('default', ['index', 'lib']);
