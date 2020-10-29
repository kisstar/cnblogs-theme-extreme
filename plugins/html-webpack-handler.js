const fs = require('fs-extra');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Handlebars = require('handlebars');

const resloveTemplate = (name) => path.resolve(__dirname, '../src/templates', `${name}.hbs`);

class HtmlWebpackHandlerPlugin {
  constructor(config) {
    this.config = config;
  }

  apply(compiler) {
    // support compiler.hooks from webpack 4
    if (!compiler.hooks) {
      return;
    }

    compiler.hooks.compilation.tap('HtmlWebpackHandlerPlugin', (compilation) => {
      this.compilation = compilation;

      // HtmlWebPackPlugin 4.x
      const hooks = HtmlWebpackPlugin.getHooks(compilation);
      hooks.afterTemplateExecution.tapAsync(
        'HtmlWebpackHandlerPlugin',
        (htmlPluginData, callback) => {
          this.data = htmlPluginData;
          this.done = callback;
          this.run();
        },
      );
    });
  }

  async run() {
    await this.addNavbarTemplate();
    await this.adjustStaticResourceURL();
    this.done(undefined, this.data);
  }

  // 对于一些无法直接获取的静态资源将其复制到开发服务器的静态目录中，然后修正路径从开发服务器中获取
  async adjustStaticResourceURL() {
    const { html: htmlString } = this.data;
    const rOriginHost = /(https:)?\/\/common\.cnblogs\.com/g;
    const rPicHost = /(src=")(?:https:)?\/\/pic.cnblogs.com(.*.png")/g;
    const rGoogleAds = /[^"]*adservice\.google\.com\/adsid[^"]*/g;

    this.data.html = htmlString
      .replace(rOriginHost, '')
      .replace(rPicHost, '$1$2')
      .replace(rGoogleAds, '');
  }

  async addNavbarTemplate() {
    const { html: htmlString, plugin } = this.data;
    const { options } = plugin;

    if (/public\/index\.html$/.test(options.template)) {
      return;
    }

    const { prefixCls, navbar } = this.config;
    const { brand, list } = navbar;
    const navbarContext = {
      prefixCls,
      title: typeof brand === 'string' ? brand : brand.text,
      logo: brand.logo,
      list,
    };
    const rawString = await fs.readFile(resloveTemplate('navbar'), 'utf8');
    const templateDelegate = Handlebars.compile(rawString);
    const templateString = templateDelegate(navbarContext);
    this.data.html = htmlString.replace(/<!--done-->\s*<div id="home">/, `${templateString}$&`);

    // 生成模式下只需要新添加的导航部分
    if (process.env.NODE_ENV === 'production') this.data.html = templateString;
  }
}

module.exports = HtmlWebpackHandlerPlugin;
