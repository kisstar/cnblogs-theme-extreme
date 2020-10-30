const path = require('path');
const fs = require('fs-extra');

const rPicHost = /(src=")(?:https:)?\/\/pic.cnblogs.com(.*.png")/g;
const rOriginHost = /(https:)?\/\/common\.cnblogs\.com/g;
const EMPTY_OBJ = Object.create(null);
const jsonMap = Object.create(null);
const templateMap = Object.create(null);
const CNBLOGS_PUBLIC = 'https://www.cnblogs.com';
const CONTENT_PUBLIC = path.resolve(__dirname, '../public');
const countURLList = ['/ajax/GetViewCount.aspx', '/ajax/GetCommentCount.aspx'];
const templateURLList = [
  '/ajax/CommentForm.aspx',
  '/ajax/UnderPostNews.aspx',
  '/ajax/CategoriesTags.aspx',
  '/ajax/BlogPostInfo.aspx',
  '/ajax/sidecolumn.aspx',
  '/ajax/post/prevnext',
  '/ajax/news.aspx',
  '/ajax/GetComments.aspx',
  '/ajax/TopLists.aspx',
];
const noopURLList = [
  '/ajax/signature.aspx',
  '/ajax/OptUnderPost.aspx',
  '/ajax/HistoryToday.aspx',
  '/ajax/Follow/GetFollowStatus.aspx',
  '/ajax/calendar.aspx',
  '/ajax/sideColumnAd',
  '/adunits/t5/nocache',
];
const jsonURLList = [
  '/group/T2',
  '/group/C1-C2',
  '/user/userinfo',
  '/ajax/blogSubscription',
  '/ajax/wechatshare/getconfig',
  '/api/v2/recomm/blogpost/reco',
];

jsonURLList.forEach((url) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const json = require(path.join(CONTENT_PUBLIC, url));

  if (url === '/user/userinfo') {
    Object.keys(json).forEach((key) => {
      const value = json[key];

      if (typeof value === 'string' && value.includes('pic.cnblogs.com')) {
        json[key] = value.replace(/.*\.com/, '');
      }
    });
  }

  jsonMap[url] = json;
});

function getRndInteger(min = 0, max = 10000) {
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

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

    // 处理特定请求
    before(app) {
      app.get('*', function handler(request, response, next) {
        const { path: requestPath } = request;

        if (countURLList.some((item) => requestPath.includes(item))) {
          return response.end(getRndInteger());
        }

        if (templateURLList.some((item) => requestPath.includes(item))) {
          const pos = path.join(
            CONTENT_PUBLIC,
            requestPath.replace(/.*(ajax[^#.?]*).*/, '$1.html'),
          );

          if (templateMap[pos]) {
            return response.send(templateMap[pos]);
          }

          const content = fs.readFileSync(pos, 'utf-8');
          const result = content.replace(rPicHost, '$1$2').replace(rOriginHost, '');
          templateMap[pos] = result;

          return response.send(result);
        }

        if (
          jsonURLList.some((url) => {
            if (requestPath.includes(url)) {
              response.json(jsonMap[url] || EMPTY_OBJ);
              return true;
            }
            return false;
          })
        ) {
          return true;
        }

        if (noopURLList.some((item) => requestPath.includes(item))) {
          return response.end();
        }

        return next();
      });

      app.post('*', function handler(request, response, next) {
        const { path: requestPath } = request;

        if (requestPath.includes('/api/v2/recomm/blogpost/reco')) {
          return response.json(jsonMap['/api/v2/recomm/blogpost/reco'] || EMPTY_OBJ);
        }

        return next();
      });
    },

    // 对于未处理的请求将重定向至博客园，以便获取页面中来自博客园的静态资源
    after(app) {
      app.get('*', function handler(request, response) {
        response.redirect(CNBLOGS_PUBLIC + request.url);
      });
    },
  };
}

module.exports = getWebpackDevelopmentConfig;
