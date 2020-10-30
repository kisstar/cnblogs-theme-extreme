/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-param-reassign */

// 调整一些无法从博客园直接获取内容的请求，转而使用开发服务器提供的假数据
const { origin } = document.location;
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
const jsonURLList = [
  '/group/T2',
  '/group/C1-C2',
  '/user/userinfo',
  '/ajax/blogSubscription',
  '/ajax/wechatshare/getconfig',
  '/api/v2/recomm/blogpost/reco',
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
const abortURLList = ['googlesyndication.com', 'img2020.cnblogs.com', 'adservice.google.com'];
const onlyChangeOrigin = ['/tag/js/gpt.js', ...templateURLList, ...jsonURLList, ...noopURLList];

$(document).ajaxSend(function beforeSend(_event, xhr, opt) {
  const { url } = opt;

  if (abortURLList.some((item) => url.includes(item))) {
    xhr.abort();
  }

  if (onlyChangeOrigin.some((item) => url.includes(item))) {
    opt.url = `${origin}${url.replace(/.*\.com/, '')}`;
  }
});
