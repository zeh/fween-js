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

/**
 * Hardcoded build parameters
 */
var options = {
	src: "ts",
	buildES6: "js-es6",
	buildES5AMD: "js-es5-amd",
	buildES5Single: "js-es5",
}

/**
 * Generic error-catching function. This is necessary because without it, some tasks (e.g. watch) crash and burn without even showing the actual error
 */
function logError(error) {
    console.error("Error occurred: " + error.toString());
    this.emit('end');
}

/**
 * Generic function to mark the end of a task, for better logging
 */
function logDivider() {
	console.log("---");
}

/**
 * TASKS PROPER
 */

/**
 * Clean all build folders
 */
gulp.task('clean', function (cb) {
	del([options.buildES6 + '/**/*', options.buildES5AMD + '/**/*', options.buildES5Single + '/**/*'], cb);
});

/**
 * Compiles TypeScript source JavaScript ES6 classes, so it can be used in other ES6-based projects
 */
gulp.task('compile-es6', function() {
	return gulp.src(options.src + '/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(ts({
			declarationFiles: true,
			noExternalResolve: true,
			removeComments: false,
			target: "es6",
			noImplicitAny: true,
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(options.buildES6));
});

/**
 * Compiles TypeScript source into a single JavaScript ES5 file (and a global Fween class), so it can be used in simple JS projects
 */
gulp.task('compile-es5', function() {
	browserify("./" + options.src + "/transitions/Fween.ts")
		.plugin('tsify', {
			noImplicitAny: true,
			target: "es5",
		})
		.bundle().on('error', logError)
		.pipe(source('fween.js'))
		.pipe(buffer())
		.pipe(replace({regex:"\/\/ +\#IFDEF +ES5SINGLE +\/\/ +", replace:''}))
		.pipe(gulp.dest(options.buildES5Single));
});

/**
 * Compiles TypeScript source into AMD (requirejs.like) JavaScript ES5 code, so it can be used in other AMD-based projects
 */
gulp.task('compile-es5-amd', function() {
	return gulp.src(options.src + '/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(ts({
			declarationFiles: true,
			noExternalResolve: true,
			removeComments: false,
			target: "es5",
			module: "amd", // commonjs, amd, system, umd
			noImplicitAny: true,
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(options.buildES5AMD));
});

/**
 * Minifies the single-file ES5 build into a smaller JavaScript file
 */
gulp.task('minify', function () {
	return gulp.src(options.buildES5Single + '/fween.js')
		.pipe(uglify()).on('error', logError)
		.pipe(concat('fween.min.js'))
		.pipe(gulp.dest(options.buildES5Single));
});

/**
 * Builds everything
 */
gulp.task('build', function() {
	runSequence('clean', ['compile-es5-amd', 'compile-es6', 'compile-es5'], 'minify', logDivider);
});

/**
 * Builds ES5 only (for development purposes)
 */
gulp.task('build-es5', function() {
	runSequence('clean', ['compile-es5'], logDivider);
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

/**
 * Watches for changes to the TypeScript source files and build the ES5 version only
 */
gulp.task('watch-es5', ['build-es5'], function () {
	gulp.watch([options.src + '/**/*.ts'], ['build-es5']);
});

/**
 * Watches for changes to the TypeScript source files and build all versions
 */
gulp.task('watch', ['build'], function () {
	gulp.watch([options.src + '/**/*.ts'], ['build']);
});

/**
 * Default task is to watch and build on demand
 */
gulp.task('default', ['watch']);
