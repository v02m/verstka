const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');



// Static server
gulp.task('brs', function() {
    browserSync.init({
        server: {
			port: 9000,			
            baseDir: 'build'
        }
    });
	
	gulp.watch('build/**/*.*').on('change', browserSync.reload);
	
	// gulp.watch('build/*.html').on('change', browserSync.reload);	
});


 /* -------  Pug compile ----------*/
gulp.task('templates:compile', function buildHTML() {
  return gulp.src('src/templates/**/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('build'));
});


/* -------  Styles compile  ------- */
gulp.task('styles:compile', function () {
  return gulp.src('src/styles/main.scss')         
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
	  .pipe(gulp.dest('build/css'));
});

/* ------------ Sprite ------------- */
gulp.task('sprite', function (cb) {
  const spriteData = gulp.src('src/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));
 // return
  spriteData.pipe(gulp.dest('build/images/'));
 // return 
  spriteData.pipe(gulp.dest('src/styles/global/'));
  cb();
});

/* ------------ Delete ------------- */
gulp.task('clean', function del(cb){
	return rimraf('build', cb);
});

/*---------- Copy fonts-----------*/
gulp.task('copy:fonts', function() {
	return gulp.src('src/fonts/**/*.*')
	.pipe(gulp.dest('build/fonts'));
});

/*---------- Copy images-----------*/
gulp.task('copy:images', function() {
	return gulp.src('src/images/**/*.*')
	.pipe(gulp.dest('build/images'));
});

/*---------- Copy -----------*/
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/*------------- Watchers--------*/
gulp.task('watch', function(){
	gulp.watch('src/templates/**/*.pug', gulp.series('templates:compile'));
	gulp.watch('src/styles/**/*.scss', gulp.series('styles:compile'));
});

/*------- Default -------*/
gulp.task('default', gulp.series(
	'clean',
	gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy:images', 'copy'),
	gulp.parallel('watch', 'brs')
    )
);


 
