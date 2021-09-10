"use strict";

/**
 * Source: https://sharkcoder.com/tools/gulp
 */

// function mergeObj(path, )


// VARIABLES

let libVar = {};
libVar.path = './lib/';

// src
libVar.src = {};
libVar.src.path = libVar.path + 'src/';
libVar.src.js = libVar.src.path + 'js/';
libVar.src.scss = libVar.src.path + 'scss/';

// dist
libVar.dist = {};
libVar.dist.path = libVar.path + 'dist/';
libVar.dist.js = libVar.dist.path + 'js/';
libVar.dist.css = libVar.dist.path + 'css/';

// watch
libVar.watch = {
	scss: {
		static: [
			libVar.src.scss + 'static.scss',
			libVar.src.scss + 'static/**/*.scss',
		],
		custom: [
			libVar.src.scss + '_custom.scss',
		],
	},
	js: {
		custom: [
			libVar.src.js + 'custom.js',
		],
	},
};

console.log(libVar);
console.log(libVar.watch.js.custom[0]);

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
	console.log(src, dst, dst_name);
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
// 		copyFile(panel.libVar + 'tools/elfinder/css/elfinder.full.css', panel.scss + 'import/elfinder', {extname: '.scss'}),
// 		copyFile(panel.libVar + 'tools/elfinder/css/theme.css', panel.scss + 'import/elfinder', {extname: '.scss'})
// 	);
// });

// SCSS Tasks
gulp.task('scss.custom', function(){
	return scss(libVar.src.scss + 'custom.scss', libVar.dist.css);
});

// JS Tasks
gulp.task('js.custom', function(){
	return js(libVar.watch.js.custom, libVar.dist.js, 'custom.min.js');
});


// Watch Tasks
gulp.task('watch', function(){
	// SCSS
	gulp.watch(libVar.watch.scss.custom, gulp.task('scss.custom'));
	
	// JS
	gulp.watch(libVar.watch.js.custom, gulp.task('js.custom'));
});