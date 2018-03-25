const gulp = require("gulp"),
    rename = require("gulp-rename"),
    clean = require("gulp-clean-fix"),
    less = require("gulp-less"),
    babel = require("gulp-babel"),
    uglify = require("gulp-uglify"),
    pump = require("pump"),
    minifyCss = require("gulp-clean-css"),
    concat = require("gulp-concat"),
    plumber = require("gulp-plumber");

gulp.task("default", function () {
    gulp.watch("public/css/less/**/*", ["concatCss"]);
    gulp.watch(["public/js/*.js", "public/js/libs/*.js"], ["concatJs"]);
});

// Gulp part for compile less to css, minify css and concat all .min.css files
gulp.task("less", function () {
    return gulp.src("public/css/less/style.less")
        .pipe(plumber())
        .pipe(less({
            paths: ["public/css/less/", "public/css/less/incs/"]
        }))
        .pipe(gulp.dest("public/css"));
});

gulp.task("minifyCss", ["less"], function () {
    return gulp.src("public/css/*.css")
        .pipe(minifyCss({ compatibility: 'ie8' }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("public/css/minify"));
});

gulp.task("concatCss", ["cleanCss", "minifyCss"], function () {
    return gulp.src("public/css/minify/*.min.css")
        .pipe(concat("main.min.css"))
        .pipe(gulp.dest("public/css/dist"));
});

gulp.task("cleanCss", function () {
    return gulp.src(["public/css/style.css", "public/css/dist/*", "public/css/minify/*"], { read: false })
        .pipe(clean());
})

// Gulp part for compile js es6 to es5, uglify and concat all .min.js files
gulp.task("compile", function () {
    return gulp.src(["public/js/*.js", "public/js/libs/*.js"])
        .pipe(babel({
            presets: ["env"]
        }))
        .pipe(gulp.dest("public/js/es5"));
});

gulp.task("uglify", ["compile"], function (cb) {
    pump([
            gulp.src('public/js/es5/*.js'),
            uglify(),
            rename({
                suffix: ".min"
            }),
            gulp.dest('public/js/compress')
        ],
        cb
    );
});

gulp.task("concatJs", ["cleanJs", "uglify"], function () {
    return gulp.src("public/js/compress/*.min.js")
        .pipe(concat("main.min.js"))
        .pipe(gulp.dest("public/js/dist"));
});

gulp.task("cleanJs", function () {
   return gulp.src(["public/js/es5/*", "public/js/compress/*", "public/js/dist/*"])
       .pipe(clean());
});