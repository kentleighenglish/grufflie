var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	cleanCss = require('gulp-clean-css'),
	plumber = require('gulp-plumber');


gulp.task('js', function(){
	var js = gulp.src([
		'res/js/*.js'
	])
	.pipe(plumber())
	.pipe(concat('scripts.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./res/dist/'));
	js.on('end', function(){
		done('JS');
	});
});

gulp.task('scss', function(){
	var scss = gulp.src('res/scss/bootstrap.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(cleanCss())
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./res//dist/'));
	scss.on('end', function(){
		done('SCSS');
	});
});

gulp.task('default', function(){
	gulp.watch('res/js/*.js', ['js']);
	gulp.watch('res/scss/*.scss', ['scss']);
});

gulp.task('compile', function(){

});

function done(msg){
	console.log('Complete '+msg);
}
