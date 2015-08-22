var browserify 	= require('browserify');
var del			= require('del');
var gulp		= require('gulp');
var concat		= require("gulp-concat");
var replace		= require('gulp-regex-replace');
var sourcemaps	= require('gulp-sourcemaps');
var ts			= require('gulp-typescript');
var uglify		= require("gulp-uglify");
var server		= require('gulp-webserver');
var runSequence	= require('run-sequence');
var tsify 		= require('tsify');
var buffer 		= require('vinyl-buffer');
var source 		= require('vinyl-source-stream');

// Catching errors is necessary because otherwise it causes watch to stop (and the default error handling doesn't show any information about the error)
function logError(error) {
    console.log("Error occurred: " + error.toString());
    this.emit('end');
}

var options = {
	src: "ts",
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
	return gulp.src(options.src + '/**/*.ts')
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
	browserify("./" + options.src + "/transitions/Fween.ts")
		.plugin('tsify', {
			//noImplicitAny: true, // Turn this off later
			target: "es5",
		})
		.bundle().on('error', logError)
		.pipe(source('fween.js'))
		.pipe(buffer())
		.pipe(replace({regex:"\/\/ +\#IFDEF +ES5SINGLE +\/\/ +", replace:''}))
		.pipe(gulp.dest(options.buildES5Single));
});

gulp.task('compile-es6', function() {
	return gulp.src(options.src + '/**/*.ts')
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
	return gulp.src(options.buildES5Single + '/fween.js')
		.pipe(uglify()).on('error', logError)
		.pipe(concat('fween.min.js'))
		.pipe(gulp.dest(options.buildES5Single));
});

gulp.task('build', function() {
	runSequence('clean', ['compile-es5-modules', 'compile-es6', 'compile-es5'], 'minify');
});

/**
 * Serves the web app (same process)
 */
gulp.task('serve-reloading', function(cb) {
	gulp.src("./")
		.pipe(server({
			livereload: true,
			directoryListing: {
				enable: true,
				path: "./"
			},
			open: false
		}));
});

/**
 * Serves the web app (same process)
 */
gulp.task('serve', function(cb) {
	gulp.src("./")
		.pipe(server({
			livereload: false,
			directoryListing: {
				enable: true,
				path: "./"
			},
			open: false
		}));
});

gulp.task('watch', ['build'], function () {
	gulp.watch([options.src + '**/*.ts'], ['build']);
});

gulp.task('default', ['watch']);
