var gulp=require("gulp"),
    uglify=require("gulp-uglify");
    imagemin=require('gulp-imagemin');
    cache=require('gulp-cache');
    // sass=require('gulp-ruby-sass');
    watch=require('gulp-watch');
    concat=require('gulp-concat');
    rename=require('gulp-rename');
    less=require('gulp-less');
    htmlmin=require('gulp-htmlmin');
    requirejs=require('gulp-requirejs');
    browserSync = require('browser-sync').create();
    wrap=require('gulp-wrap');

//图片的无损压缩
var imgarr=['./src/images/**/*.{png,jpg,gif,ico}','./wrap/images/*.{png,jpg,gif,ico}'];
gulp.task('imagemin',function(){
    gulp.src(imgarr)
       // .pipe(cache(imagemin()))
       .pipe(gulp.dest('./dist/images'));
});

gulp.task('js-index',function(){
    requirejs({
        baseUrl:"./src/js",
        paths:{
            "zepto":"lib/zepto"
        },
        name:"main",
        out:"index.js"
    })
        .pipe(gulp.dest("./dist/js"));

    gulp.src("./src/js/lib/require.js")
        .pipe(uglify())
        .pipe(rename({
            suffix:'.min'
        }))
        .pipe(gulp.dest('./dist/js'))
});

// gulp.task("uglify",function(){
// 	gulp.src("./src/js/*.js")
// 	    .pipe(concat('all.js'))
// 	    .pipe(rename('index.merge.min.js'))
// 	    .pipe(uglify())
// 	    .pipe(gulp.dest("./dist/js"));

// });

gulp.task('htmlmin',function(){
    gulp.src("./src/*.html")
    // .pipe(rename("index.min.html"))
    .pipe(htmlmin())
    .pipe(gulp.dest("./dist"))
});
var lessarr=['src/css/*.less','wrap/css/*.less']
gulp.task('less',function(){
    gulp.src(lessarr)
    .pipe(less())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('build',function(){
    gulp.src('./src/*.html')
        .pipe(wrap({src:'wrap/default.html'}))
        .pipe(gulp.dest('./dist'))
})

gulp.task('watch',['less','htmlmin','imagemin','js-index','build'],function(){
    browserSync.reload();
});
// gulp.task('watch',function(){
//     gulp.watch('./src/js/*.js',['uglify']);
// });
// gulp.task('watch',function(){
//     gulp.watch('./src/html/index/*.html',['htmlmin']);
// });

gulp.task('server',function(){
    browserSync.init({
        server:{
            baseDir:"./dist"
        }
    });
    gulp.watch([lessarr,'./src/*.html',imgarr,'./src/**/*.js','./wrap/default.html'],['watch']);
});

gulp.task('default',['server']);

