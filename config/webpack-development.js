const path = require('path');

function getWebpackDevelopmentConfig() {
  return {
    compress: true,
    // 默认情况下，WebpackDevServer 还提供当前目录中的物理文件
    // 为避免暴露敏感文件，在此处仅暴露项目根目录下的 public 目录中内容
    contentBase: path.resolve(__dirname, '../public'),
    watchContentBase: true,
    hot: true,
    open: true,
    // 在编译出错的时候，在浏览器页面上显示错误
    overlay: true,
    clientLogLevel: 'warn',
  };
}

module.exports = getWebpackDevelopmentConfig;
