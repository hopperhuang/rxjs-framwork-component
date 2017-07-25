const webpack = require('webpack');
const path = require('path');
const Merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
// path 需要是一个绝对路径
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CommonConfig = require('./webpack.common.js');

// const extractCSS = new ExtractTextPlugin('stylesheets/[name]-one.css');
// const extractLESS = new ExtractTextPlugin('stylesheets/[name]-two.css');
// 处理css和less
// 在webpack -p参数下， 输出undefined
// 在 set NODE_ENV=production &&  webpack -p 的node命令下，输出production
// console.log(process.env.NODE_ENV);

module.exports = Merge(CommonConfig, {
  watch: true,
  entry: {
    app: [
      'react-hot-loader/patch',
      // 开启 React 代码的模块热替换(HMR)

      'webpack-dev-server/client?http://localhost:8080',
      // 为 webpack-dev-server 的环境打包代码
      // 然后连接到指定服务器域名与端口

      'webpack/hot/only-dev-server',
      // 为热替换(HMR)打包好代码
      // only- 意味着只有成功更新运行代码才会执行热替换(HMR)
      //
      // 入口文件
      './src/index.jsx',
    ],
  },
  output: {
    // 文件路径。
    path: path.resolve(__dirname, 'dist'),
    // 出口文件，以entry的Key来命名。
    filename: '[name].js',
    // 项目中的所有资源指定一个基础路径。它被称为公共路径(publicPath)。
    // 当需要缓存静态资源时，可以这样设置output.publicPath:/assets/
    // 定义静态公共资源访问前缀路径，cdn等静态资源的请求路径，具体可以看这个文章：
    // https://stackoverflow.com/questions/28846814/what-does-publicpath-in-webpack-do
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  // loaders的设置在下面。
  devServer: {
    // 开启服务器的模块热替换(HMR)
    // // 将module.hot api 暴露给我们的代码，可以在diamagnetic中调用module.hot；
    hot: true,

    // 内容基于什么路径去提供，一般跟output的path相同，因为再devServer时，
    // 内存中会虚拟出一个output.path文件，所以热更新的文件内容，需要从output.path来
    // 提供
    contentBase: path.resolve(__dirname, 'dist'),

    // 和上文 output 的“publicPath”值保持一致，因为output.publicPath
    // 已经定义好了静态资源的访问入口，所以要想访问生成的静态资源，必须从这个入口进入。
    publicPath: '/',
    // 用于处理开发过程中，进入子路由的问题。
    historyApiFallback: true,
  },
  plugins: [
    // 开启全局的模块热替换(HMR)
    new webpack.HotModuleReplacementPlugin(),
    // 用于清晰定位变动模块的名称
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        // 开发环境时，将环境变量设置为development
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    // 将manifest生成的运行代码内联插入到html中，减少请求，同时修复无法动态加载组件的问题。
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest',
    }),
    new HtmlWebpackPlugin({
      // // 定义模板 和 生成的 html 文件
      // 定义了模板路径，这个路径时相对于context上下文的。
      template: './src/template/index.ejs',
      // 定义了输出路径，这里的相对路径和绝对路径都基于out.path。
      // 这里的Out.path时dist文件夹,sever会基于这文件夹啊去提供服务，在devServer里面定义了
      // 所以我们需要件html文件生成到这个文件夹。
      filename: './index.html',
      // filename: './dist/index.html',
      favicon: './src/images/icon_qq.png',
      // chunksSortMode: 'dependency',
    }),
  ],
});
