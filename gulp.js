const gulp = require('gulp');
const through2 = require('through2').obj; // работа с потоками объектов
const File = require('vinyl');

// gulp.task('assets', function () {
// 	return gulp.src('src/assets/**/*.*')
// 		.pipe(through2(function (file, enc, callback) {
// 			// console.log(file);
// 			let file2 = file.clone();
// 			file2.path += '.bak';
// 			this.push(file2);
// 			callback(null, file);
// 		}))
// 		.pipe(gulp.dest('public'));

// 		// file - обьект модуля Vinyl
// 		// file.clone()
// 		// clone() - метод обьекта file
// });

gulp.task('assets', function () {

	const mtimes = {};

	return gulp.src('src/assets/**/*.*')
		.pipe(through2(
			function (file, enc, callback) {
				mtimes[file.relative] = file.stat.mtime;
				callback(null, file); //передача файла дальше по цепочке
			},
			function (callback) {
				let manifest = new File({
					//cwd(по умолчанию текущая директория) 
					//base path contents(содержимое файла)
					contents: new Buffer(JSON.stringify(mtimes)),
					base: process.cwd(), //текущая директория
					path: process.cwd() + '/manifest.json'
				});
				this.push(manifest);
				callback(); // сигнал о завершении
			}
		))
		.pipe(gulp.dest('public'));
});

	// file.relative - часть файла после закрепленной части (**/*.*)