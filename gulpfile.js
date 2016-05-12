/* eslint-env node */

var gulp            = require('gulp');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
//var browserSync     = require('browser-sync').create();


gulp.task('default', ['copy-html', 'copy-assets', 'scripts', 'styles'],
    function() {
        // browserSync.init( { server: './dist' } );

        gulp.watch('sass/**/*.scss', ['styles']);
        gulp.watch('js/**/*.js', ['scripts']);
        gulp.watch('assets/**/*.*', ['copy-assets']);
        // gulp.watch(['./dist/index.html', './dist/js/*.js', './dist/css/*.css'], browserSync.reload);
        gulp.watch('./index.html', ['copy-html']);
    });

/*
    Concatenates in dist/js/all.js
 */
gulp.task('scripts', function() {
    gulp.src('js/**/*.js')
        .pipe( concat('all.js'))
        .pipe( gulp.dest('dist/js') );
});

/*
 Concatenates and MINIFIES in carpeta dist/js/all.js
 Not in default, only gulp scripts-dist 
 */
gulp.task('scripts-dist', function() {
    gulp.src('js/**/*.js')
        .pipe( concat('all.js'))
        .pipe( uglify() )
        .pipe( gulp.dest('dist/js') );
});

/*
 Copies index.html to dist folder
 */
gulp.task('copy-html', function() {
    gulp.src('./index.html')
        .pipe( gulp.dest('./dist') );
});


/*
    Copies assets (images,...) to dist folder
 */
gulp.task('copy-assets', function() {
    gulp.src('assets/**/*.*')
        .pipe( gulp.dest('dist/assets') );
});


/*
    All tasks prior to production launch
 */
gulp.task('dist', [
    'copy-html',
    'copy-assets',
    'styles',
    'scripts-dist'
]);

/*
    Compiles Sass and adds prefixes
 */

gulp.task('styles', function() {
    gulp.src('sass/**/*.scss')  
        .pipe( sass().on('error', sass.logError) )
        .pipe( autoprefixer({
            browsers: ['last 2 versions']
        }) )
        .pipe( gulp.dest('dist/css') );   
});

