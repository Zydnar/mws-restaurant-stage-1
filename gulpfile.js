const SERVER_PORT = '8080';
const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const browserify = require("gulp-browserify");
const watch = require('gulp-watch');
const browserSync = require('browser-sync');
const compass = require('gulp-compass');
const csso =  require('gulp-csso');
const responsive = require('gulp-responsive-images');
const isProduction = process.env.NODE_ENV === 'production';
const noop = require('gulp-noop');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('compass', function () {
    gulp.src('./public/scss/styles.scss')
        .pipe(
            compass(
                {
                    config_file: './config.rb',
                    sass: './public/scss',
                    css: './public/css'
                }
            )
        )
        .pipe(csso({sourceMap: !isProduction}))
        .pipe(gulp.dest('./public/css'));
});
gulp.task('build', function () {
    gulp.src('./src/js/index.js')
        .pipe(isProduction?sourcemaps.init():noop())
        .pipe(
            browserify(
                {
                    transform: ['babelify']
                }
            )
        )
        .pipe(isProduction?uglify():noop())
        .pipe(rename('main.js'))
        .pipe(isProduction?sourcemaps.write('./public/js'):noop())
        .pipe(gulp.dest('./public/js'));
});
gulp.task('js-watch', ['build'], browserSync.reload);
gulp.task('watch', function () {
    browserSync(
        {
            proxy: `localhost:${SERVER_PORT}`
        }
    );
    watch('public/src/**', ['js-watch']);
});
gulp.task('responsive-images', function () {
    gulp.src('./public/img/*.jpg')
        .pipe(responsive({
                             '*.jpg': [{
                                 width: 266,
                                 suffix: '-100-1x',
                                 quality: 100
                             }, {
                                 width: 266 * 2,
                                 suffix: '-100-2x',
                                 quality: 10
                             }, {
                                 width: 266 * 3,
                                 suffix: '-100-3x',
                                 quality: 10
                             }]
                         }))
        .pipe(gulp.dest('./public/img'));
});
