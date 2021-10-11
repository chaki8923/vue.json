import gulp, { task } from 'gulp';
import webpackConfing from './webpack.config.js';
import webpack from 'webpack-stream';
import minifycss from 'gulp-minify-css';
var sass = require('gulp-sass')(require('sass'));
import browserSync from 'browser-sync';
import notify from  'gulp-notify';
import plumber from 'gulp-plumber';
import eslint from 'eslint';


//gulpタスクの作成
//gulp.task()を使っていく
//第一引数に任意の名前、第二引数に実行した処理を関数で書いていく
//関数の中はpipeで処理を繋げていく

const Build = (done) =>{
  gulp.src('src/app.js')
  .pipe(plumber({
    errorHandler: notify.onError("Error: <%= error.message %>")
  }))
  .pipe(webpack(webpackConfing))
  .pipe(gulp.dest('dist/js/'))
};

//css圧縮
const minifyCss = (done) =>{
  gulp.src('src/css/*.css')
  .pipe(minifycss())
  .pipe(gulp.dest('dist/css/'));
  done();
}
exports.minifyCss = minifycss;

const BrowseReload = (done) =>{
  browserSync.init({
    server: {
      baseDir: './', //対象ディレクトリ
      index: 'index.html'
    }
  });
  done();
}
exports.BrowseReload = BrowseReload;

const Reload = (done) =>{
  browserSync.reload();
  done();
}

gulp.task('bs-reload', function () {
})

//sassのコンパイル
const compileSass = (done) => {
  gulp.src('./src/scss/*.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    })
    )
    .on('error', sass.logError)
    .pipe(gulp.dest('src/css/'));
  done();
};
exports.compileSass = compileSass;

var path = {
  srcDir: 'src',
  dstDir: 'dist'
}

const Eslint = (done) => {

  return gulp.src(['src/*.js'])
  .pipe(plumber({
    errorHandler:function(error){
      const taskName = 'eslint';
      const title = 'task' + taskName + '' + error.plugin;
      const errorMsg = 'error' + error.message;
      //ターミナルにエラーを出力
      console.error(title + '/n' + errorMsg);
      //エラーを通知
      notify.onError({
        title:title,
        message:errorMsg,
        time:3000
      });
    }
  }))
  .pipe(eslint({useEslintrc:true}))
  .pipe(eslint.format())
  .pipe(eslint.failOnError())
  .pipe(plumber.stop())
}


//監視ファイル
const watchFile = (done) => {
  gulp.watch('src/css/*.css',minifyCss);
  gulp.watch('src/app.js',Build);
  gulp.watch('./src/scss/*.scss', compileSass);
  // gulp.watch('./*.html', Reload);
  // gulp.watch('./*.html', BrowseReload);
  gulp.watch('./dist/*.+(js|css)', Reload);
  gulp.watch('src/*.js',Eslint);
 
  done();
}
exports.watchFile = watchFile;
//デフォルトで動かすタスクを指定
//設定するとターミナルでgulpと入力するだけで実行される
exports.default = gulp.series(
  watchFile,Build
);



