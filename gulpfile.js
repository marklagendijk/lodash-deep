var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var karma = require("gulp-karma");

var config = require('./config/config.js');

gulp.task("test", ["minify"], function(){
    gulp.src(config.testFiles)
        .pipe(karma({
            configFile: 'config/karma.conf.js',
            action: 'run'
        }));
});

gulp.task("minify", function(){
    gulp.src("lodash.deep.js")
        .pipe(uglify())
        .pipe(rename("lodash.deep.min.js"))
        .pipe(gulp.dest("./"));
});