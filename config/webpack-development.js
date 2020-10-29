const path = require('path');

const CNBLOGS_PUBLIC = 'https://www.cnblogs.com';
const CONTENT_PUBLIC = path.resolve(__dirname, '../public');

function getWebpackDevelopmentConfig() {
  return {
    compress: true,
    // 默认情况下，WebpackDevServer 还提供当前目录中的物理文件
    // 为避免暴露敏感文件，在此处仅暴露项目根目录下的 public 目录中内容
    contentBase: CONTENT_PUBLIC,
    watchContentBase: true,
    hot: true,
    open: true,
    // 在编译出错的时候，在浏览器页面上显示错误
    overlay: true,
    clientLogLevel: 'warn',

    // 对于未处理的请求将重定向至博客园，以便获取页面中来自博客园的静态资源
    after(app) {
      app.get('*', function handler(request, response) {
        response.redirect(CNBLOGS_PUBLIC + request.url);
      });
    },
  };
}

module.exports = getWebpackDevelopmentConfig;
