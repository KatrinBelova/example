
// "gulp": "github:gulpjs/gulp#4.0"

// const gulp = require('gulp');


// gulp.task('demo:hello', function(callback) {
// 	console.log("Hello");
// 	callback();
// });

// Vinul-FS

// gulp.task('default', function() {
// 	return gulp.src('src/**/*.*')    
// 		// .on('data', function(file) {
// 		// 	console.log(file);
// 		// })
// 		// обработчик, данные копирования
// 		.pipe(gulp.dest(function (file) {
// 			return file.extname == '.js' ? 'js' :
// 				file.extname == '.css' ? 'css' : 'dest';
// 		}));
// });
//minimatch    **/*.{js,css} - оба пути подходящие
// '{source1,source2}/**/*.*'
//gulp.src(['src/**/*.*'], {read: false}) - файл читать не нужно 
//

// npm i -g node-static сервер
// cd public/
// static

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps'); //информация о изменении файла
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');
const pug = require('gulp-pug');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
//NODE_ENV - переменная окружения
//при запуске продакшн - NODE_ENV=production gulp

gulp.task('views', function buildHTML() {
  return gulp.src('src/index.pug')
  .pipe(pug())
  .pipe(gulp.dest('./public')); 
});

gulp.task('styles', function () {
	return gulp.src('src/styles/main.styl')
		.pipe(gulpIf(isDevelopment, sourcemaps.init())) //file.sourceMap
		.pipe(stylus())
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest('public'));
});

gulp.task('clean', function () {
	return del('public');
});

gulp.task('assets', function () {
	return gulp.src('src/assets/**')
		.pipe(gulp.dest('public'));
});

gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('views', 'styles', 'assets')));