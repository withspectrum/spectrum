var gulp 		= require('gulp'),
styles 			= require('gulp-ruby-sass'),
prefix 			= require('gulp-autoprefixer'),
maps			= require('gulp-sourcemaps');

var path = {
		input: 		'./src/css/*.scss',
		main:       './src/css/spector.scss',
		output:     './src/css/'
};

gulp.task('default', ['watch']);

// Watch task
gulp.task('watch', function() {
	gulp.watch(path.input, ['styles']);
});

//SASS task
gulp.task('styles', function () {
	return styles(path.main, { sourcemap: true })
	.pipe(maps.write())
	.pipe(prefix("last 2 versions"))
	.pipe(gulp.dest(path.output));
});