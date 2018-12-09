import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as tsconfig from './tsconfig.json';

// compile ts
gulp.task('compile', () => {
  return gulp.src(['src/**/*.ts'])
    .pipe(ts((<any>tsconfig).compilerOptions))
    .pipe(gulp.dest('dist'));
});

// copy src/lib into dist
gulp.task('copy:lib', () => {
  return gulp.src(['src/lib/**/*'], { base: 'src' })
    .pipe(gulp.dest('dist'));
});

// copy README.md package.json into dist
gulp.task('copy', () => {
  return gulp.src(['README.md', 'package.json'])
    .pipe(gulp.dest('dist'));
});

// build dist
gulp.task('build', gulp.series('compile', 'copy:lib', 'copy'));
