# gulp-example

gulp练习例子，可以克隆到本地查看效果。

```bash
git clone https://github.com/jingjingke/gulp-example.git
```

## gulp命令 ##

使用命令前确保已经全局安装gulp，并且将项目依赖安装完成。

```bash
# 全局安装gulp
npm install --global gulp
# 进入gulp-example安装依赖
npm install
```
### 开发
```bash
gulp dev
```
在开发环境中使用该命令，此时主要针对的是scss预处理文件进行编译，并在监听文件变化时重新编译，对其它文件不进行处理。

### 发布
```bash
gulp build
```
在发布时使用该命令生成dist文件夹，针对项目资源文件（html\css\js\img）进行压缩及名称hash去缓存。

### 其它
虽然有单独的gulp js\gulp css等执行任务的命令，但因为发布时存在文件变化会有hash值变化，而引用这些资源的文件也需要改变（牵一发而动全身），效果类似于用gulp build，所以其它的gulp task建议不要单独使用。
