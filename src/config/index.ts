const { pathname } = document.location;
const rPost = /\/p\/\d+\.html/;

export const PREFIX_CLS = 'kisstar';

export const BRAND = {
  text: "Kisstar's 博客",
  logo: 'https://images.cnblogs.com/cnblogs_com/dongwanhong/1857964/o_201003115132logo.png',
};

export const IS_POST = rPost.test(pathname) || pathname === '/post.html'; /* for development */
