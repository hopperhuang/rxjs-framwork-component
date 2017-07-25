const webpack = require('webpack');
const path = require('path');
// path 需要是一个绝对路径
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssPxtorem = require('postcss-pxtorem');

const extractCSS = new ExtractTextPlugin('stylesheets/[name]-one.css');
const extractLESS = new ExtractTextPlugin('stylesheets/[name]-two.css');

module.exports = {
  context: __dirname,
  resolve: { // 于解释缺乏后缀名的文件
    extensions: ['.js', '.less', '.json', '.jsx'],
    // 明确公共文件库中的一些别名。
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      redux: path.resolve(__dirname, 'node_modules/redux'),
      'react-redux': path.resolve(__dirname, 'node_modules/react-redux'),
      'redux-saga': path.resolve(__dirname, 'node_modules/redux-saga'),
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
        }),
      },
      {
        test: /\.less$/i,
        use: extractLESS.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer,
                  postcssPxtorem({
                    rootValue: 20,
                    unitPrecision: 5,
                    propList: ['*'],
                    selectorBlackList: [],
                    replace: true,
                    mediaQuery: false,
                    minPixelValue: 2,
                  }),
                ],
              },
            },
            'less-loader',
          ],
        }),
      },
      // 下面是不启用extract-text-webpack-plugin插件的做法。
      // {
      //   test: /\.css$/,
      //   use: [
      //     'style-loader',
      //     // 将css引入到js文件中，并在文件头中插入style标签
      //     // 'css-loader',
      //     // 启用module的做法，为将css引入到js中,并生成哈希的类名。
      //     // {
      //     //   loader: 'css-loader',
      //     //   options: {
      //     //     modules: true,
      //     //   },
      //     // },
      //   ],
      // },
      // {
      //   test: /\.less$/i,
      //   use: [
      //     'style-loader',
      //     'css-loader',
      //     'less-loader',
      //   ],
      // },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'babel-loader',
          'eslint-loader',
        ],
      },
      // 读取文件,图片。
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          // 这里的outputPath时基于 output中的out.pathu路径的，我们要将
          // 文件输出到dist/assets/images/文件夹，所以要将路径做如下设置。
          // 具体设置可以看file-loader
          'file-loader?name=[name].[ext]&outputPath=images/',
        ],
      },
      // 读取字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  plugins: [
    // // 代码分离css,将css单独打包,不在以style的形式，分别插入到html中，而使生成一个styles.css文件,一次加载。异步并行加载css
    extractCSS,
    extractLESS,
    // 代码分离，将公共第三方库打包成一个entry chunk,只打包node_modules目录里面中的模块 隐藏式公共提取。
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        // This prevents stylesheet resources with the .css or .scss extension
        // from being moved from their original chunk to the vendor chunk
        if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
          return false;
        }
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      // 生成一个mainfest的commo chunk 这个chunk不包含模块,但是包含webpack run-time 代码
      name: 'manifest',
      minChunks: Infinity,
    }),
    // new HtmlWebpackPlugin({
    //   // // 定义模板 和 生成的 html 文件
    //   template: './src/template/index.html',
    //   // 定义了输出路径，这里的相对路径和绝对路径都基于out.path。
    //   filename: '../index.html',
    //   // filename: './dist/index.html',
    //   favicon: './src/images/icon_qq.png',
    // }),
  ],
};
