const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const smartgrid = require('smart-grid');
const cleanCSS = require('gulp-clean-css');

var settings = {
    outputStyle: 'scss', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '30px', /* gutter width px || % || rem */
    mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1140px', /* max-width оn very large screen */
        fields: '15px' /* side fields */
    },
    breakPoints: {
        lg: {
            width: '1100px', /* -> @media (max-width: 1100px) */
        },
        md: {
            width: '960px'
        },
        sm: {
            width: '780px',
            fields: '15px' /* set fields only if you want to change container.fields */
        },
        xs: {
            width: '560px'
        }
    }
};
 
smartgrid('./src/sass', settings);

function style() {
    return gulp.src('./src/sass/main.scss')
    .pipe(autoprefixer({
        browsers: ['> 0.1%'],
        cascade: false
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({
        level: {
          2: {
            mergeSemantically: true, // controls semantic merging; defaults to false
          }
        }
      }))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

function script() {
    return gulp.src(['./src/js/*.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}

function clean() {
    return del(['build/*']);
}

// function concatCSS() {
//     return gulp.src(['./build/css/main.css', './src/sass/fonts.scss', './src/sass/animation.scss'])
//       .pipe(concat('main.css'))
//       .pipe(gulp.dest('./build/css'));
//   }

function watchTask() {
    gulp.watch('./src/sass/**/*.scss', style);
    gulp.watch('./src/js/**/*.js', script);
    gulp.watch("./*.html").on('change', browserSync.reload);
}
// gulp.task('concat', concatCSS);
gulp.task('watch', watchTask);
gulp.task('script', script);
gulp.task('clean', clean);
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('build', gulp.series(clean, gulp.parallel(style, script)));
gulp.task('watch', gulp.parallel('browser-sync', watchTask));