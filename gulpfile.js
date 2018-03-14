
// "gulp": "github:gulpjs/gulp#4.0"

// const gulp = require('gulp');


// gulp.task('demo:hello', function(callback) {
// 	console.log("Hello");
// 	callback();
// });

// Vinyl-FS

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
const newer = require('gulp-newer'); // gulp-changed 
// фильтрует более новые файлы, чем находящиеся в указанном месте
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const remember = require('gulp-remember');
const path = require('path');
const cached = require('gulp-cached');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
//multipipe
// stream-combiner2

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
//NODE_ENV - переменная окружения
//при запуске продакшн - NODE_ENV=production gulp

gulp.task('views', function buildHTML() {
  return gulp.src('src/index.pug')
  .pipe(pug())
  .pipe(gulp.dest('./public')); 
});

gulp.task('styles', function () {
	return gulp.src('src/modules/main.styl')
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'Styles',
					message: err.message
				};
			})
		}))
		.pipe(gulpIf(isDevelopment, sourcemaps.init())) //file.sourceMap
		.pipe(stylus())
		// .on('error', function (err) {
		// 	console.log(err.message);
		// 	this.end(); //сигнал о завершении обработки
		// })
		// .on('error', notify.onError(function (err) {
		// 	return {
		// 		title: 'Styles',
		// 		message: err.message
		// 	}
		// }))
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest('public'));

	//return gulp.src('src/styles/**/*.css'/*, {since: gulp.lastRun('styles')}*/)
		//.pipe(cached('styles')) 
		// не прорускает файлы с таким же содержимым при запуске ранее,
		// since - по дате модификации
		//.pipe(autoprefixer())
		//.pipe(remember('styles'))
		//.pipe(concat('all.css'))
		//.pipe(gulp.dest('public'));
});


gulp.task('clean', function () {
	return del('public');
});

gulp.task('assets', function () {
	return gulp.src('src/assets/**', {since: gulp.lastRun('assets')})
		.pipe(newer('public'))
		.pipe(gulp.dest('public'));
});

// {since: gulp.lastRun('assets')} - с последнего изменения

gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('views', 'styles', 'assets')));

gulp.task('watch', function () {

	gulp.watch('src/modules/**/*.styl', gulp.series('styles'));
	gulp.watch('src/assets/**/*.*', gulp.series('assets'));

	// gulp.watch('src/styles/**/*.css', gulp.series('styles')).on('unlink', function(filepath) {
	// 	remember.forget('styles', path.resolve(filepath));
	// 	delete cached.caches.styles[path.resolve(filepath)];
	// });
});

gulp.task('serve', function() {
	browserSync.init({
		server: 'public'
	});

	browserSync.watch('src/public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));

// gulp.task('dev', gulp.series('styles', 'watch'));