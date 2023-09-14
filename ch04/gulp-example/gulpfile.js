const gulp = require("gulp");
const help = require("gulp-help-four");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const watch = require("gulp-watch");

help(gulp, {});

const toBuild = () =>
  gulp
    .src("app/*.jsx")
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env", "@babel/react"],
      })
    )
    .pipe(concat("all.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));

gulp.task("default", "to build project in 'dist' directory", toBuild);

gulp.task("watch", "to watch changes in scripts and rebuild project", () => {
  watch("app/*.jsx", toBuild);
});
