/*
 * Global variables
 */
var gulp = require( 'gulp' ),
	scss = require( 'gulp-sass' ),
	browserSync = require( 'browser-sync' ),
	plumber = require( 'gulp-plumber' ),//エラー通知
	notify = require( 'gulp-notify' ),//エラー通知
	imagemin = require( 'gulp-imagemin' ),//画像圧縮
	imageminPngquant = require( 'imagemin-pngquant' ),//png画像の圧縮
	pleeease = require( 'gulp-pleeease' ),//ベンダープレフィックス
	useref = require( 'gulp-useref' ),//ファイル結合
	gulpif = require( 'gulp-if' ),// if文
	del = require( 'del' ),//ディレクトリ削除
	runSequence = require( 'run-sequence' ),//並行処理
	sourcemaps = require( 'gulp-sourcemaps' ),
	paths = {
		rootDir : '.',
		dstrootDir : 'dest',
		srcDir : 'images',
		dstDir : 'dest/images',
		serverDir : 'nifl.dev'
	}

/*
 * Sass
 */
gulp.task( 'scss', function() {
	gulp.src( paths.rootDir + '/sass/**/*.scss' )
		.pipe( sourcemaps.init() )
		.pipe( plumber({
			errorHandler: notify.onError( 'Error: <%= error.message %>' )
		}) )
		.pipe( scss() )
		.pipe( pleeease( {minifier: false} ) )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( paths.rootDir ) );
});

/*
 * Pleeease
 */
gulp.task( 'pleeease', function() {
	return gulp.src( paths.rootDir )
		.pipe( pleeease({
			// minifier: false, //圧縮の有無 true/false
			sass: true
		}) )
		.pipe( plumber ( {
			errorHandler: notify.onError( 'Error: <%= error.message %>' )
		} ) )
		.pipe( gulp.dest( paths.rootDir ) );
});

/*
 * Imagemin
 */
gulp.task( 'imagemin', function(){
	var srcGlob = paths.srcDir + '/**/*.+(jpg|jpeg|gif|svg)';
	var imageminOptions = {
		optimizationLevel: 7
	};

	gulp.src( srcGlob )
		.pipe( imagemin( imageminOptions ) )
		.pipe( gulp.dest( paths.dstDir ) );
});
gulp.task( 'imageminPngquant', function () {
	gulp.src( paths.srcDir + '/**/*.png' )
		.pipe( imageminPngquant( { quality: '65-80', speed: 1 } )())
		.pipe( gulp.dest( paths.dstDir ) );
});

/*
 * Useref
 */
gulp.task( 'html', function () {
	return gulp.src( [paths.rootDir + '/**/*.+(html|php)', '!'+ paths.rootDir + '/node_modules/**'] )
		.pipe( useref( {searchPath: ['.', 'dev']} ) )
		.pipe( gulp.dest( paths.dstrootDir ) );
});

/*
 * Browser-sync
 */
gulp.task( 'browser-sync', function() {
	browserSync.init({
		// server: {
		// 	baseDir: paths.rootDir,
		// 	routes: {
		// 		"/node_modules": "node_modules"
		// 	}
		// },
		proxy: "nifl.dev",
		notify: true
	});
});
gulp.task( 'bs-reload', function () {
	browserSync.reload();
});

/*
 * Default
 */
gulp.task( 'default', ['browser-sync'], function() {
	var bsList = [
		paths.rootDir + '/**/*.html',
		paths.rootDir + '/**/*.php',
		paths.rootDir + '/js/**/*.js',
		paths.rootDir + '/*.css'
	];
	gulp.watch( paths.rootDir + '/sass/**/*.scss', ['scss'] );
	gulp.watch( bsList, ['bs-reload'] );
});

/*
 * Build
 */
gulp.task( 'clean', del.bind( null, [paths.dstrootDir] ) );
// gulp.task( 'clean', function( clb ) {
// 	del.bind( null, [paths.dstDir, paths.dstrootDir + '/sass'], clb );
// });
gulp.task( 'devcopy', function () {
	return gulp.src([
		paths.rootDir + '/**/*.*',
		'!'+ paths.rootDir + '/.git',
		'!'+ paths.rootDir + '/css/**',
		'!'+ paths.rootDir + '/js/**',
		'!'+ paths.rootDir + '/sass/**',
		'!'+ paths.rootDir + '/**/*.html',
		'!'+ paths.rootDir + '/.gitignore',
		'!'+ paths.rootDir + '/gulpfile.js',
		'!'+ paths.rootDir + '/package.json',
		'!'+ paths.rootDir + '/node_modules/**',
		'!'+ paths.rootDir + '/.DS_Store'
	], {
		dot: true
	}).pipe( gulp.dest( paths.dstrootDir ) );
});
gulp.task( 'gitdel', del.bind( null, [paths.dstrootDir + '/.git', paths.dstrootDir + '/readme.md'] ) );
gulp.task( 'build', ['clean'], function ( cb ) {
	runSequence( 'scss', ['html', 'imagemin', 'imageminPngquant', 'devcopy'], 'gitdel', cb );
});
