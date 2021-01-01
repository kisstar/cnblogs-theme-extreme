const IMAGE_HOST = process.env.NODE_ENV === 'development' ? '' : 'https://images.cnblogs.com';

// 针对博客的默认自定义配置
const config = {
  username: 'dongwanhong',
  prefixCls: 'kisstar',
  navbar: {
    brand: {
      text: "Kisstar's 博客",
      logo: `${IMAGE_HOST}/cnblogs_com/dongwanhong/1857964/o_201003115132logo.png`,
    },
    list: [
      {
        text: '博客园',
        href: 'https://www.cnblogs.com/',
      },
      {
        text: '笔记',
        href: 'https://dongwanhong.gitee.io/notebook/',
      },
      {
        text: '案列',
        href: 'https://dongwanhong.gitee.io/source-code/',
      },
      {
        text: '思否',
        href: 'https://segmentfault.com/u/dongwanhong/',
      },
      {
        text: '简历',
        href: 'https://dongwanhong.gitee.io/resume/',
      },
      {
        text: 'GitHub',
        href: 'https://github.com/kisstar/',
      },
    ],
  },
};

// 通过 prefixCls 选项可以设置自定义样式的前缀，为了方便统一设置这里将 prefixCls 作为一个顶层选项
// Prettier 可以通过 Glimmer 解析器格式化 Handlebars，但却不支持通过 `../` 来修改上下文，导致遍历时不好访问 prefixCls 选项
// 所以在此将 prefixCls 选项写入循环数据中，以便访问
config.navbar.list.forEach((item) => {
  // eslint-disable-next-line no-param-reassign
  item.prefixCls = config.prefixCls;
});

module.exports = config;
