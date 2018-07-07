import gulp from 'gulp';
import mocha from 'gulp-mocha';

process.argv.forEach(function (val, index) {
  console.log(index + ': ' + val);
});

gulp.task('tests-main', (a) => {
  console.log('===>', a);
  return gulp.src('src/**/*-api.spec.ts')
    .pipe(mocha({
      reporter: 'nyan',
      require: ['ts-node/register']
    }));
});

// gulp.task('default', ['tests-main']);