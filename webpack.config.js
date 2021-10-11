const path = require('path');

module.exports = {
  mode: 'development',
  entry:path.join(__dirname,'src/app.js'),
  output:{
    path:path.join(__dirname,'dist/js'),
    filename:'bandle.js'
  },

  module:{
    rules:[
      {
        test:/\.js$/,
        exclude:/node_modules/,
        loader:'babel-loader',
        options:{
          presets:['@babel/preset-env']
        }
      }
    ]
  },
  resolve:{
    modules:[path.join(__dirname,'src'),'node_modules'],
    extensions:['.js'],
    alias:{
      vue:'vue/dist/vue.esm.js'
    }
  }
};