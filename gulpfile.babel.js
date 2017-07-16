import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import fs from 'fs';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackConfig from './webpack.config.babel';
import webpackStream from 'webpack-stream';
import config from './config';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// ==========================================================================
// Task function
// ==========================================================================

// HtmlIndex
function pug() {
	return gulp.src(config.tasks.pug.src)
	.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
	.pipe($.pug(config.tasks.pug.options))
	// .pipe($.replace(/[\u000B\u200A-\u200D\uFEFF]/g, ''))
	.pipe(gulp.dest(config.tasks.pug.dest))
	.pipe(reload({ stream: true }));
}

// Sass compile
function sass() {
	return gulp.src(config.tasks.sass.src)
	.pipe($.if(!config.envProduction, $.sourcemaps.init()))
	.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
	.pipe($.sass(config.tasks.sass.options))
	.pipe($.if(!config.envProduction, $.sourcemaps.write()))
	.pipe($.pleeease({
		autoprefixer: ['last 2 versions'],
		minifier: !config.envProduction ? false : true,
		mqpacker: true,
	}))
	.pipe($.size({ title: 'sass' }))
	.pipe($.concat('common.css'))
	.pipe(gulp.dest(config.tasks.sass.dest))
	.pipe(reload({ stream: true }));
}

// Js compile
function babel() {
	return gulp.src(config.tasks.babel.src)
		.pipe($.plumber())
		.pipe(webpackStream(webpackConfig, webpack))
		.pipe(gulp.dest(config.tasks.babel.dest));
}

// Build folder delete
function clean(cb) {
	return del([config.dirs.dest]).then(() => cb());
}

// Local server
function bs(cb) {
	return browserSync.init(null, {
		server: {
			baseDir: config.dirs.dest,
		},
		open: 'external',
		ghostMode: false,
		notify: false,
	}, cb);
}

// ==========================================================================
// Tasks
// ==========================================================================

// Watch
gulp.task('watch', (done) => {
	gulp.watch(config.tasks.watch.pug, gulp.series(pug));
	gulp.watch(config.tasks.watch.sass, gulp.series(sass));
	gulp.watch(config.tasks.watch.babel, gulp.series(babel));
	done();
});

// Default Build
gulp.task('build', gulp.series(
	clean,
	gulp.parallel(pug, sass, babel),
	bs,
));

// Default Build
gulp.task('default', gulp.series('build', 'watch'));
