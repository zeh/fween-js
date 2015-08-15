var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function (cb) {
	del(['js/**/*', 'js-min/**/*'], cb);
});

gulp.task('compile-es5', function() {
	gulp.src('ts/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(ts({
			declarationFiles: true,
			noExternalResolve: true,
			removeComments: false,
			target: "es5",
			module: "amd", // commonjs, amd, system, umd
			noImplicitAny: false,
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('js-es5'));
});

gulp.task('compile-es6', function() {
	gulp.src('ts/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(ts({
			declarationFiles: true,
			noExternalResolve: true,
			removeComments: false,
			target: "es6",
			noImplicitAny: false,
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('js-es6'));
});

gulp.task('minify', function () {
	gulp.src('js-es5/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('js-min'))
		.pipe(concat('all.js'))
		.pipe(gulp.dest('js-min'));
});

gulp.task('build', ['clean', 'compile-es5', 'compile-es6']);

gulp.task('watch', ['build'], function () {
	gulp.watch(['ts/**/*.ts'], ['build']);
});

gulp.task('default', ['build']);
