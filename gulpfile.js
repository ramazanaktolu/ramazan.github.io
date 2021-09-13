"use strict";

const production = true;

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
			lib.src.js + 'custom2.js',
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
const sourcemaps = require('gulp-sourcemaps');
const path = require("path");

// JS function
function js(src, dst, dst_name, srcBase = lib.src.js) {
	let sourceMapsOptions = {
		includeContent: false, // bunun false ile çalışabilmesi için alttaki sourceRoot kısmının doğru ayarlanması gerekir
		sourceRoot: path.relative(dst, srcBase) // Önemli. Genellikle Çıktı: "../../src/js"
	};
	
	if (production) {
		return gulp.src(src)
			.pipe(concat(dst_name))
			.pipe(terser({
				output: {
					comments: false,
				},
			}))
			.pipe(gulp.dest(dst));
	} else {
		return gulp.src(src)
			.pipe(sourcemaps.init())
			.pipe(concat(dst_name))
			.pipe(sourcemaps.write('.', sourceMapsOptions))
			.pipe(gulp.dest(dst));
	}
}

// SCSS function
function scss(src, dst, srcBase = lib.src.scss){
	let sourceMapsOptions = {
		includeContent: false, // bunun false ile çalışabilmesi için alttaki sourceRoot kısmının doğru ayarlanması gerekir
		sourceRoot: path.relative(dst, srcBase) // Önemli. Genellikle Çıktı: "../../src/scss"
	};
	
	if (production) {
		return gulp.src(src)
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(autoprefixer({
				overrideBrowserslist: ['last 2 versions'],
				cascade: false,
			}))
			.pipe(gulp.dest(dst));
	} else {
		return gulp.src(src)
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(autoprefixer({
				overrideBrowserslist: ['last 2 versions'],
				cascade: false,
			}))
			.pipe(sourcemaps.write('.', sourceMapsOptions))
			.pipe(gulp.dest(dst));
	}
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