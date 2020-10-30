const { origin, pathname } = document.location;
const rPost = /\/p\/\d+\.html/;
const rLocal = /localhost/;

export const IS_DEV = rLocal.test(origin);

export const IS_POST = rPost.test(pathname) || pathname === '/post.html'; /* for development */

export const PREFIX_CLS = 'kisstar';

const IMAGE_HOST = !IS_DEV ? 'https://images.cnblogs.com' : '';

export const BRAND = {
  text: "Kisstar's 博客",
  logo: `${IMAGE_HOST}/cnblogs_com/dongwanhong/1857964/o_201003115132logo.png`,
};
