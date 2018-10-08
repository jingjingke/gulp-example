const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const del = require('del');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sequence = require('gulp-sequence');

// 获取任务名（判断出两种环境：build 和 dev，后面根据环境决定路径）
let options = process.argv.slice(2)[0] === 'dev' ? 'dev' : 'build';

// 文件来源位置
let sourcePath = {
    html: 'src/html/',
    css: 'src/scss/',
    img: 'src/images/',
    js: 'src/js/'
};
// 文件目标位置
let destPath = {
    html: 'dist/html/',
    css: 'dist/scss/',
    img: 'dist/images/',
    js: 'dist/js/'
};
// 判断当dev环境时目标位置可能变化
if (options === 'dev') {
    destPath = {
        html: '',
        css: 'src/css/',
        img: '',
        js: ''
    }
}

// 执行html任务（使用gulp-htmlmin进行压缩）
gulp.task('html', function () {
    return gulp.src(sourcePath.html + '*.html')
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
        .pipe(gulp.dest(destPath.html));
});

// 执行scss任务（使用的是gulp-sass对scss文件进编译与压缩，同时添加浏览器兼容前缀等）
gulp.task('css', function () {
    return gulp.src(sourcePath.css + '*.scss')
        .pipe(sass({
            outputStyle: options === 'dev' ? 'expanded' : 'compressed'
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
        .pipe(gulp.dest(destPath.css));
});

// 监听scss文件（主要用在dev时）
gulp.task('watch-scss', function () {
    let watcher = gulp.watch(sourcePath.css + '*.scss', ['css']);
    watcher.on('change', function (event) {
        // console.log('Event type: ' + event.type);
        // console.log('Event path: ' + event.path);
        if ('deleted' === event.type) {
            let fileName = event.path.substring(event.path.lastIndexOf('\\'), event.path.indexOf('\.'));
            del.sync(destPath.path + fileName + '.css');
        }
    });
});

// 执行imagemin任务（使用gulp-imagemin对图片进行压缩，效果好像一般后期看看要不要换）
gulp.task('imagemin', function () {
    return gulp.src(sourcePath.img + '*.{png,jpg,gif,svg}')
        .pipe(imagemin({
            // optimizationLevel: 7,    // 优化等级0-7，默认3
            // progressive: true,       // 无损压缩jpg图片，默认false
            // interlaced: true,        // 隔行扫描gif进行渲染，默认false
            // multipass:true           // 优化svg，默认false
        }))
        .pipe(gulp.dest(destPath.img))
});

// 执行js任务（使用gulp-babel让js支持es6，gulp-uglify对文件进行压缩）
gulp.task('js', function () {
    return gulp.src([sourcePath.js + '*.js', '!' + sourcePath.js + 'test*.js'])
        .pipe(babel({               //参考：https://babeljs.io/docs/en/options
            presets: ['@babel/env']
        }))
        .pipe(uglify({                                          //参考：https://github.com/mishoo/UglifyJS2#minify-options
            ie8: true,                                          //是否支持IE8，默认false
            compress: {
                drop_console: true                              //移除console，默认false
            },
            // mangle: false,                                   // 修改变量名，默认true
            mangle: {
                reserved: ['require', 'exports', 'module', '$'] //修改变量名不为false时，排除混淆关键字
            }
        }))
        .pipe(gulp.dest(destPath.js));
});

// 执行dev或build任务前先将目标文件夹清空
gulp.task('del', function () {
    let delDirs = [];
    for (let key in destPath) {
        if (destPath[key]) {
            delDirs.push(destPath[key])
        }
    }
    return del.sync(delDirs);
});

// 两个核心任务：dev 和 build，用在开发和发布时
gulp.task('dev', sequence('del', 'css', 'watch-scss'));
gulp.task('build', sequence('del', 'html', 'css', 'imagemin', 'js'));

gulp.task('default', ['dev']);