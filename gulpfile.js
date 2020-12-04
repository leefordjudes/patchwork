const gulp = require('gulp');

function copyAssets() {
  return gulp.src('./src/fonts/**')
    .pipe(gulp.dest('dist/fonts'));
}

exports.build = gulp.series(copyAssets);