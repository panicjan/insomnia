"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const del = require("del");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./production/"
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean assets
function clean() {
  return del(["./production/assets/"]);
}

// Optimize Images
function images() {
  return gulp
    .src("./development/img/**/*")
    .pipe(newer("./production/assets/img"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("./production/assets/img"));
}

// Scripts
function scripts() {
  return (
    gulp
      .src(["./development/js/**/*"])
      .pipe(plumber())
      .pipe(concat('main.js'))
      .pipe(gulp.dest("./production/assets/js/"))
      .pipe(browsersync.stream())
  );
}

// CSS task
function css() {
  return gulp
    .src("./development/css/**/*")
    .pipe(plumber())
    .pipe(concat('main.css'))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./production/assets/css/"))
    .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch("./development/css/**/*", css);
  gulp.watch("./development/js/**/*", scripts);
  gulp.watch("./development/img/**/*", images);
}

// define complex tasks
const build = gulp.series(clean, gulp.parallel(css, scripts, images));
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.images = images;
exports.css = css;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;