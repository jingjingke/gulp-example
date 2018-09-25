var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    del = require('del');


gulp.task('html', function () {
    return gulp.src('src/html/*.html')
        .pipe(htmlmin({
            removeComments: true,                //清除HTML注释
            collapseWhitespace: true,            //压缩HTML
            collapseBooleanAttributes: true,     //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true,         //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,    //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true,                      //压缩页面JS
            minifyCSS: true                      //压缩页面CSS
        }))
        .pipe(gulp.dest('dist/html'));
});


gulp.task('scss', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(postcss([autoprefixer({
            browsers: [
                'last 7 versions',
                'chrome >= 34',
                'safari >= 6',
                'ios >= 6',
                'android >= 4.4',
                'Firefox >= 20'
            ]
        })]))
        .pipe(gulp.dest('src/css'));
})

gulp.task('dev',function () {
    var watcher = gulp.watch('src/scss' + '/*.scss',['scss']);
    watcher.on('change',function (event) {
        // console.log('Event type: ' + event.type);
        // console.log('Event path: ' + event.path);
        if ("deleted" === event.type) {
            var fileName = event.path.substring(event.path.lastIndexOf("\\"), event.path.indexOf("\."));
            del.sync('src/css/' + fileName + '.css');
        }
    });
})

