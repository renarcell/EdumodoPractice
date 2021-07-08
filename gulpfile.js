const gulp         = require('gulp');
const browserSync  = require('browser-sync');
const sass         = require('gulp-sass');
const cleanCSS     = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require("gulp-rename");
const imagemin     = require('gulp-imagemin');
const htmlmin      = require('gulp-htmlmin');

gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "dist"
        },
        browser: "firefox",
    });

    gulp.watch("dist/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {
    return gulp.src("src/scss/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('imagemin', function() {
    gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img/'));
    gulp.src('src/icons/**')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/icons/'));
});

gulp.task('htmlmin', function() {
    return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('movefiles', function() {
    gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js/'));
    return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('watch', function() {
    gulp.watch("src/scss/**/*.+(scss|sass)", gulp.parallel('styles'));
    gulp.watch("src/img/**/*", gulp.parallel('imagemin'));
    gulp.watch("src/*.html", gulp.parallel('htmlmin'));
    gulp.watch("src/fonts/**/*", gulp.parallel('movefiles'));
    gulp.watch("src/js/**/*", gulp.parallel('movefiles'));
});

gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'htmlmin', 'movefiles'));