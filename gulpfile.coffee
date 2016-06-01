gulp = require 'gulp'
slim = require 'gulp-slim'

gulp.task 'build', ->
  gulp.src 'src/*.slim'
    .pipe slim pretty: true
    .pipe gulp.dest './'
