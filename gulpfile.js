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
lib.dist.path = lib.path + 'src/';
lib.dist.js = lib.dist.path + 'js/';
lib.dist.scss = lib.dist.path + 'scss/';

// watch
lib.watch = {
	scss: {
		static: [
			lib.src.scss + 'static.scss',
			lib.src.scss + 'static/**/*.scss',
		],
		custom: [
			lib.src.scss + '_custom.scss',
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
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const mergeStream = require('merge-stream');


// Clean assets
function clear() {
	return gulp.src('./assets/*', {
		read: false
	})
		.pipe(clean());
}

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

function copyFile(src, dst, renameOptions) {
	/*
	rename({
		dirname: "main/text/ciao",
		basename: "aloha",
		prefix: "bonjour-",
		suffix: "-hola",
		extname: ".md"
	}) // output ./dist/main/text/ciao/bonjour-aloha-hola.md
	
	rename({
		extname: '.scss',
	})
	*/
	
	return gulp.src(src)
		.pipe(rename(renameOptions))
		.pipe(gulp.dest(dst));
}

// gulp.task('p.copy.css2sass.elfinder', function(){
// 	return mergeStream(
// 		copyFile(panel.lib + 'tools/elfinder/css/elfinder.full.css', panel.scss + 'import/elfinder', {extname: '.scss'}),
// 		copyFile(panel.lib + 'tools/elfinder/css/theme.css', panel.scss + 'import/elfinder', {extname: '.scss'})
// 	);
// });

// SCSS Tasks
gulp.task('scss.custom', function(){
	return scss(lib.src.scss + 'custom.scss', lib.dist.css);
});

// JS Tasks
gulp.task('p.js.custom', function(){
	return js(lib.src.js.custom, lib.dist.js, 'custom.min.js');
});


// Watch Tasks
gulp.task('watch', function(){
	// SCSS
	gulp.watch(lib.watch.scss.custom, gulp.task('scss.custom'));
	
	// JS
	gulp.watch(lib.watch.js.custom, gulp.task('js.custom'));
});