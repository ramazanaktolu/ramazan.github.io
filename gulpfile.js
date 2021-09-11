"use strict";

/**
 * Source: https://sharkcoder.com/tools/gulp
 */

// function mergeObj(path, )


// VARIABLES

let lib = {};
lib.path = './lib/';

// src
lib.src = {};
lib.src.path = lib.path + 'src/';
lib.src.js = lib.src.path + 'js/';
lib.src.scss = lib.src.path + 'scss/';

// dist
lib.dist = {};
lib.dist.path = lib.path + 'dist/';
lib.dist.js = lib.dist.path + 'js/';
lib.dist.css = lib.dist.path + 'css/';

// watch
lib.watch = {
	scss: {
		static: [
			lib.src.scss + 'static.scss',
			lib.src.scss + 'static/**/*.scss',
		],
		custom: [
			lib.src.scss + 'custom.scss',
		],
	},
	js: {
		custom: [
			lib.src.js + 'custom.js',
		],
	},
};

// END VARIABLES

const gulp = require('gulp');

// Load plugins

const terser = require('gulp-terser');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');

// JS function
function js(src, dst, dst_name) {
	return gulp.src(src, {sourcemaps: true})
		.pipe(concat(dst_name))
		.pipe(terser({
			output: {
				comments: false
			},
		}))
		.pipe(gulp.dest(dst, {sourcemaps: '.'}));
}

// SCSS function
function scss(src, dst){
	return gulp.src(src, {sourcemaps: true})
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest(dst, {sourcemaps: '.'}));
}

// SCSS Tasks
gulp.task('scss.custom', function(){
	return scss(lib.src.scss + 'custom.scss', lib.dist.css);
});

// JS Tasks
gulp.task('js.custom', function(){
	return js(lib.watch.js.custom, lib.dist.js, 'custom.min.js');
});


// Watch Tasks
gulp.task('watch', function(){
	// SCSS
	gulp.watch(lib.watch.scss.custom, gulp.task('scss.custom'));
	
	// JS
	gulp.watch(lib.watch.js.custom, gulp.task('js.custom'));
});