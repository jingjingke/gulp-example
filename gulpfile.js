var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    del = require('del'),
    csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify');


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

gulp.task('dev', function () {
    var watcher = gulp.watch('src/scss' + '/*.scss', ['scss']);
    watcher.on('change', function (event) {
        // console.log('Event type: ' + event.type);
        // console.log('Event path: ' + event.path);
        if ("deleted" === event.type) {
            var fileName = event.path.substring(event.path.lastIndexOf("\\"), event.path.indexOf("\."));
            del.sync('src/css/' + fileName + '.css');
        }
    });
})

gulp.task('mincss', function () {
    return gulp.src('src/css/*.css')
        .pipe(csso())
        .pipe(gulp.dest('dist/css'));
})

gulp.task('imagemin', function () {
    return gulp.src('src/images/*.{png,jpg,gif,svg}')
        .pipe(imagemin({
            // optimizationLevel: 7,    // 优化等级0-7，默认3
            // progressive: true,       // 无损压缩jpg图片，默认false
            // interlaced: true,        // 隔行扫描gif进行渲染，默认false
            // multipass:true           // 优化svg，默认false
        }))
        .pipe(gulp.dest('dist/images'))
})

gulp.task('js', function () {
    return gulp.src(['src/js/*.js','!src/js/test*.js'])
        .pipe(uglify({                                          //参考：https://github.com/mishoo/UglifyJS2#minify-options
            ie8: true,                                          //是否支持IE8，默认false
            compress:{
                drop_console:true                               //移除console，默认false
            },
            // mangle: false,                                   // 修改变量名，默认true
            mangle: {
                reserved: ['require', 'exports', 'module', '$'] //修改变量名不为false时，排除混淆关键字
            }
        }))
        .pipe(gulp.dest('dist/js'));
})

gulp.task('build', ['html', 'mincss', 'imagemin', 'js'])
