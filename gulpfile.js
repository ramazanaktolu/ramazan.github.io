"use strict";

/**
 * Source: https://sharkcoder.com/tools/gulp
 */


// VARIABLES
let root = {
	path: '../',
}

root.lib = root.path + 'lib/';
root.theme_lib = root.lib + 'default/';
root.scss = root.theme_lib + 'scss/';
root.css = root.theme_lib + 'css/';
root.js = root.theme_lib + 'js/';

let panel = {
	path: root.path + 'panel/', // normalde root.path + 'panel/'
}
panel.lib = panel.path + 'lib/';
panel.js = panel.lib + 'src/js/';
panel.js_dist = panel.lib + 'dist/js/';
panel.scss = panel.lib + 'src/scss/';
panel.css = panel.lib + 'dist/css/';
panel.files = {
	scss: {
		custom: [
			panel.scss + '_runner/run_custom.scss',
			panel.scss + '__custom.scss',
			panel.scss + '_responsive.scss',
			panel.scss + 'custom.scss',
		],
		static: [
			panel.scss + '_runner/run_static.scss',
			panel.scss + 'import/static/**/*.scss', // all nested files in static directory
			panel.scss + 'static.scss',
		],
		codemirror: [
			panel.scss + '_runner/run_codemirror.scss',
			panel.scss + 'import/static/codemirror/**/*.scss',
			panel.scss + 'import/static/_codemirror.scss',
		],
		bootstrap: [
			panel.scss + '_runner/run_bootstrap.scss',
			panel.scss + 'import/static/bootstrap/**/*.scss',
		],
		ckeditor: [
			panel.scss + 'ckeditor.scss',
		],
	},
	js: {
		custom: [
			panel.js + '_runner/run_custom.js',
			panel.js + '_custom.js',
		],
		static: [
			panel.js + '_runner/run_static.js',
			panel.js + 'static/jquery.js',
			panel.js + 'static/jquery-ui.js',
			panel.js + 'static/bootstrap.bundle.js',
			panel.js + 'static/toast.js',
			panel.js + 'static/datatables.js',
			panel.js + 'static/select2.js',
		],
		codemirror: [
			panel.js + '_runner/run_codemirror.js',
		],
	},
}

const codemirrorData = require(panel.path + 'pages/_tools/update_scripts/codemirror/data.json');
codemirrorData.js.forEach(function(item){
	panel.files.js.static.push(panel.js + 'static/codemirror/' + item);
	panel.files.js.codemirror.push(panel.js + 'static/codemirror/' + item);
});
// END VARIABLES

const gulp = require('gulp');

// Load plugins

const terser = require('gulp-terser');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const rename = require("gulp-rename");
const mergeStream = require("merge-stream");


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

// Panel Custom SCSS
gulp.task('p.scss.custom', function(){
	return scss([panel.scss + 'custom.scss'], panel.css);
});

// Panel Static SCSS
gulp.task('p.scss.static', function(){
	return scss([panel.scss + 'static.scss'], panel.css);
});

// Panel Login SCSS
gulp.task('p.scss.login', function(){
	return scss([panel.scss + 'login.scss'], panel.css);
});

// Panel CodeMirror SCSS
gulp.task('p.scss.codemirror', function(){
	return scss([panel.scss + 'import/static/codemirror.scss'], panel.css);
});

// Panel Bootstrap SCSS
gulp.task('p.scss.bootstrap', function(){
	return scss([panel.scss + 'import/static/bootstrap/bootstrap.scss'], panel.css);
});

// Panel CKEditor SCSS
gulp.task('p.scss.ckeditor', function(){
	return scss([panel.scss + 'ckeditor.scss'], panel.css);
});

// Panel Custom JS
gulp.task('p.js.custom', function(){
	return js(panel.files.js.custom, panel.js_dist, 'custom.min.js');
});

// Panel Static JS
gulp.task('p.js.static', function(){
	return js(panel.files.js.static, panel.js_dist, 'static.min.js');
});

// Panel CodeMirror JS
gulp.task('p.js.codemirror', function(){
	return js(panel.files.js.codemirror, panel.js_dist, 'codemirror.min.js');
});

gulp.task('watch', function(){
	
	
	
	// PANEL ************************************************************
	// SCSS
	gulp.watch(panel.files.scss.custom, gulp.task('p.scss.custom'));
	gulp.watch(panel.files.scss.static, gulp.task('p.scss.static'));
	gulp.watch([panel.scss + 'login.scss'], gulp.task('p.scss.login'));
	gulp.watch(panel.files.scss.codemirror, gulp.task('p.scss.codemirror'));
	gulp.watch(panel.files.scss.bootstrap, gulp.task('p.scss.bootstrap'));
	gulp.watch(panel.files.scss.ckeditor, gulp.task('p.scss.ckeditor'));
	
	// JS
	gulp.watch(panel.files.js.custom, gulp.task('p.js.custom'));
	gulp.watch(panel.files.js.static, gulp.task('p.js.static'));
	gulp.watch(panel.files.js.codemirror, gulp.task('p.js.codemirror'));
	// END PANEL ********************************************************
});