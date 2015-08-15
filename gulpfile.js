var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var server = require('gulp-webserver');
var amdOptimize = require('amd-optimize');

// Catching errors is necessary because otherwise it causes watch to stop (and the default error handling doesn't show any information about the error)
function logError(error) {
    console.log("Error occurred: " + error.toString());
    this.emit('end');
}

var options = {
	buildES6: "js-es6",
	buildES5Modules: "js-es5-amd",
	buildES5Single: "js-es5",
	buildES5Minified: "js-min",
}

// Tasks proper
gulp.task('clean', function (cb) {
	del([options.buildES6 + '/**/*', options.buildES5Modules + '/**/*', options.buildES5Single + '/**/*', options.buildES5Minified + '/**/*'], cb);
});

gulp.task('compile-es5-modules', function() {
	return gulp.src('ts/**/*.ts')
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
		.pipe(gulp.dest(options.buildES5Modules));
});

gulp.task('compile-es5', function() {
	return gulp.src(options.buildES5Modules + '/transitions/Fween.js')
        .pipe(amdOptimize('Fween'))
        .pipe(concat('fween.js'))
        .pipe(gulp.dest(options.buildES5Single));
});

gulp.task('compile-es6', function() {
	return gulp.src('ts/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(ts({
			declarationFiles: true,
			noExternalResolve: true,
			removeComments: false,
			target: "es6",
			noImplicitAny: false,
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(options.buildES6));
});

gulp.task('minify', function () {
	return gulp.src(options.buildES5Single + '/**/*.js')
		.pipe(uglify()).on('error', logError)
		.pipe(concat('fween.js'))
		.pipe(gulp.dest(options.buildES5Minified));
});

gulp.task('build', function() {
	runSequence('clean', ['compile-es5', 'compile-es6'], 'compile-es5-modules', 'minify');
});

/**
 * Serves the web app (same process)
 */
gulp.task('serve-reloading', function(cb) {
	gulp.src("examples/test/index.html")
		.pipe(server({
			livereload: true,
			directoryListing: {
				enable: true,
				path: "examples/test/"
			},
			open: false
		}));
});

/**
 * Serves the web app (same process)
 */
gulp.task('serve', function(cb) {
	gulp.src("examples/test/index.html")
		.pipe(server({
			livereload: false,
			directoryListing: {
				enable: true,
				path: "examples/test/"
			},
			open: false
		}));
});

gulp.task('watch', ['build'], function () {
	gulp.watch(['ts/**/*.ts'], ['build']);
});

gulp.task('default', ['watch']);
