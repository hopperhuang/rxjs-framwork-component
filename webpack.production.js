const Merge = require('webpack-merge');
const webpack = require('webpack');
// const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CommonConfig = require('./webpack.common.js');

module.exports = Merge(CommonConfig, {
  entry: {
    app: './src/index.jsx',
  },
  output: {
    // 将文件输出到dist/assets/ 目录下
    path: path.resolve(__dirname, 'dist/assets/'),
    // 出口文件，以entry的Key来命名。
    // filename: '[name].js',
    // 为每个文件生成唯一的哈希值，当依赖没有更新时，只更新应用代码，不更新公共代码库。即vendor文件。
    // 通过chunk内容去确定hash，chunk内容不变，hash就不变。
    filename: '[name].[chunkhash].js',
    // run-time文件命名方法。
    chunkFilename: '[name].[chunkhash].js',
    // chunkhash只能用再生产环境，用于缓存代码。
    // 生产环境下，只有再需要特工缓存的情况下，才配置publicPath,将文件输出到
    // 在所有url前加上/assets/路径前缀直接加载localhost下的assets,访问localhost:3000/assets/
    // 建议结合sever.js中的app.use(express.static('dist'));一起来理解。
    publicPath: '/assets/',
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        // 生产环境时，将环境变量设置为production
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // 生成chunkhash的时候，webpack会根据chunk的内容去生成，在chunk的引用中，为了减少文件大小，使用的时id标识符，这就导致一个问题，
    // 当我们引入新的文件时，即使共公共模块没有改变，因为新文件的引入,引用文件（模块）的id却改变了，id改变了，自然导致chunkhash改变，
    // 所以我们的缓存就失效了，利用HashedModuleIdsPlugin，将引用模块用hash去标识，而不是用id去标识，可以解决引入新文件后，公共模块hchunkhash
    // 改变的问题。
    // 官方推荐开发时用NamedModulesPlugin,生成时，用HashedModuleIdsPlugin。
    new webpack.HashedModuleIdsPlugin(),
    // Plugin to replace a standard webpack chunkhash with md5.
    new WebpackChunkHash(),
    // 使用 ChunkManifestWebpackPlugin，它会将 manifest 提取到一个单独的 JSON 文件中。
    // 这将用一个 webpack runtime 的变量替换掉chunk manifest。
    // new ChunkManifestPlugin({
    //   filename: 'chunk-manifest.json',
    //   manifestVariable: 'webpackManifest',
    //   // 因为我们从入口块(entry chunk)中移除了 manifest，所以我们现在有责任为 webpack 提供它。
    //   // <![CDATA[
    //   // window.webpackManifest =
    //   // {"0":"main.5f020f80c23aa50ebedf.js","1":"vendor.81adc64d405c8b218485.js"}
    // // ]]>
    // // 将inlineManifest设置为true,内联插入变量。
    //   inlineManifest: true,
    // }),
    // 将manifest生成的运行代码内联插入到html中，减少请求，同时修复无法动态加载组件的问题。
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest',
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      // magle属性会对变量名进行压缩
      mangle: {
        // 忽略ie8怪癖
        screw_ie8: true,
         // Pass true to not mangle function names. Useful
         //  for code relying on Function.prototype.name.
        keep_fnames: true,
        // expcet 用于跳过某些变量名不被压缩打包。
        // except: ['$super', '$', 'exports', 'require']，
      },
      compress: {
        // 忽略ie8怪癖
        screw_ie8: true,
        // 忽略警告
        warnings: false,
      },
      comments: false,
    }),
    new HtmlWebpackPlugin({
      // // 定义模板 和 生成的 html 文件
      template: './src/template/index.ejs',
      // 定义了输出路径，这里的相对路径和绝对路径都基于out.path。
      // 基于dist/assets 路径，我们要将html文件生成到dist,其他文件生成到dist/assets,
      // 所以要返回上一层。
      filename: '../index.html',
      // filename: './dist/index.html',
      favicon: './src/images/icon_qq.png',
    }),
  ],
});
