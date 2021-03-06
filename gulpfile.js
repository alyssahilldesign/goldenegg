/**
 * Gulp Configuration
 */

var environment = 'development', // 'production' or 'development'

	gulp = 			require('gulp'),
	sass = 			require('gulp-sass'),
	autoprefixer = 	require('gulp-autoprefixer'),
	minifycss = 	require('gulp-minify-css'),
	uglify = 		require('gulp-uglify'),
	rename = 		require('gulp-rename'),
	stripDebug = 	require('gulp-strip-debug'),
	jsHint = 		require('gulp-jshint'),
	concat = 		require('gulp-concat'),
	notify = 		require('gulp-notify'),
	cache = 		require('gulp-cache'),
	plumber = 		require('gulp-plumber'),
	
	// used with browser extension
	livereload = 	require('gulp-livereload'),
	
	// required for svg icons
	svgmin = 		require('gulp-svgmin'),
	svgstore = 		require('gulp-svgstore'),
	gulpif = 		require('gulp-if'),
	cheerio = 		require('gulp-cheerio'),
	
	compression = ( 'production' === environment ? 'compressed' : 'expanded' );


/**
 * Error handler
 */
var onError = function( error ) {
	notify.onError({
		title:    "Gulp",
		subtitle: "Failure!",
		message:  "Error: <%= error.message %>"
	})(error);
	this.emit('end');
}


/**
 * CSS
 */
gulp.task('styles', function() {
	return gulp.src('assets/scss/style.scss')
		.pipe( plumber( { errorHandler: onError } ) )
		.pipe(sass({ style: compression }))
		.pipe(autoprefixer('last 2 versions', '> 1%', 'android > 4'))
		.pipe(gulp.dest('assets/css'))
		.pipe(minifycss())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('assets/css'))
		.pipe(livereload())
});

gulp.task('styles-login', function() {
	return gulp.src('assets/scss/login.scss')
		.pipe(sass({ style: compression }))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('assets/css'))
		.pipe(notify({ message: 'Admin styles task complete' }));
});

gulp.task('styles-editor', function() {
	return gulp.src('assets/scss/editor.scss')
		.pipe(sass({ style: compression }))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('assets/css'))
		.pipe(notify({ message: 'Editor styles task complete' }));
});


/**
 * JAVASCRIPT
 */
gulp.task('scripts', function() {
	if ( 'production' === environment ) {
		return gulp.src([
				'assets/js/src/libs/*.js',
				'assets/js/src/**/*.js',
				'components/**/*.js',
			])
			.pipe(concat('scripts.js'))
			.pipe(jsHint())
			.pipe(stripDebug())
			.pipe(uglify())
			.pipe(gulp.dest('assets/js'))
			.pipe(notify({ message: 'Production scripts task complete' }));
	} else {
		return gulp.src([
				'assets/js/src/libs/*.js',
				'assets/js/src/**/*.js',
				'components/**/*.js',
			])
			.pipe(concat('scripts.js'))
			.pipe(jsHint())
			.pipe(gulp.dest('assets/js'))
			.pipe(livereload())
			.pipe(notify({ message: 'Scripts task complete' }));
	}
});


/**
 * SVG ICONS
 *
 * 'gulp icons' (only compiles icons)
 *
 */
gulp.task('icons', function() {
	return gulp.src('assets/icons/src/*')
		.pipe( gulpif('production'==environment, svgmin()) )
		.pipe( svgstore({ inlineSvg: true }) )
		.pipe( cheerio({
			run: function( $, file ) {
				$('svg').addClass('hide');
				$('symbol[id!=logo]').find('path,g,polygon,circle,rect').removeAttr('fill');
			},
			parserOptions: { xmlMode: true },
		}))
		.pipe( rename('icons.svg') )
		.pipe( gulp.dest('assets/icons') )
		.pipe( notify({
			title: 'Images',
			message: 'Icons complete'
		}) );
});


/**
 * GULP Task
 *
 * 'gulp' (does not compile icons)
 *
 */
gulp.task('default', function() {
	gulp.start('styles', 'styles-login', 'styles-editor', 'scripts');
});


/**
 * GULP WATCH Task
 *
 * 'gulp watch' (does not compile styles-login, styles-editor or icons)
 *
 */
gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('assets/scss/**/*.scss', ['styles']);
	gulp.watch('components/**/*.scss', ['styles']);
	gulp.watch('assets/js/src/**/*.js', ['scripts']);
	gulp.watch('components/**/*.js', ['scripts']);
});
