var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var karma = require("karma").server;
var jasmine = require("gulp-jasmine");

gulp.task("test-browser", ["minify"], function(callback){
    karma.start({
        configFile: process.cwd() + '/config/karma.conf.js'
    }, callback);
});

gulp.task("test-node", ["minify"], function(){
    return gulp.src('test/*')
        .pipe(jasmine());
});

gulp.task("test", ["test-browser", "test-node"]);

gulp.task("minify", function(){
    return gulp.src("lodash-deep.js")
        .pipe(uglify())
        .pipe(rename("lodash-deep.min.js"))
        .pipe(gulp.dest("./"));
});
