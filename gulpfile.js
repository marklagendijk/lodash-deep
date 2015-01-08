var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var karma = require("karma").server;
var jasmine = require("gulp-jasmine");
var fs = require('fs');

gulp.task("test-browser", ["minify"], function(callback){
    karma.start({
        configFile: process.cwd() + '/config/karma.conf.js'
    }, callback);
});

gulp.task("test-node", ["minify"], function(){
    return gulp.src('test/*')
        .pipe(jasmine());
});

gulp.task("concat", function (done) {
  var factoryBody = (
      "/* begin src/lodash-deep.js */\n" +
      fs.readFileSync("src/lodash-deep.js", "utf8") + "\n" +
      "/* end src/lodash-deep.js */"
  )
  .split("\n")
  .map(function (line) {
      return line.trim() ? "    " + line : line;
  })
  .join("\n");

  var replaceFlag = "/*@factory@*/";
  var umd = fs.readFileSync("src/umd.js", "utf8");
  var umdCompat = fs.readFileSync("src/umd.factory.js", "utf8");

  fs.writeFileSync("lodash-deep.js", umd.replace(replaceFlag, factoryBody));
  fs.writeFileSync("factory.js", umdCompat.replace(replaceFlag, factoryBody));
  done();
});

gulp.task("test", ["test-browser", "test-node"]);

gulp.task("minify", ["concat"], function(){
    return gulp.src(["lodash-deep.js", "factory.js"])
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest("./"));
});
