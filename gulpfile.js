import gulp from 'gulp';
import sass from 'gulp-sass';
import * as dartSass from 'sass'; // Fixed Sass import
import pug from 'gulp-pug';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';

const sassCompiler = sass(dartSass);
const browserSyncServer = browserSync.create();

// Paths
const paths = {
  src: {
    scss: 'src/assets/styles/**/*.scss', // Better pattern for SCSS files
    pug: 'src/**/*.pug', // All Pug files
    js: 'src/assets/js/**/*.js' // Better JS pattern
  },
  dest: {
    css: 'build/assets/css',
    html: 'build',
    js: 'build/assets/js'
  }
};

// Compile SCSS
export function styles() {
  return gulp.src(paths.src.scss)
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(paths.dest.css))
    .pipe(browserSyncServer.stream());
}

// Compile Pug
export function templates() {
  return gulp.src('src/*.pug') // Compile only root Pug files
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.dest.html))
    .pipe(browserSyncServer.stream());
}

// Process JS
export function scripts() {
  return gulp.src(paths.src.js)
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(gulp.dest(paths.dest.js))
    .pipe(browserSyncServer.stream());
}

// Watch and reload
export function watch() {
  browserSyncServer.init({
    server: {
      baseDir: './build'
    }
  });
  
  gulp.watch(paths.src.scss, styles);
  gulp.watch(paths.src.pug, templates); // Watch all Pug files
  gulp.watch(paths.src.js, scripts);
}

// Default task
export default gulp.parallel(styles, templates, scripts, watch);