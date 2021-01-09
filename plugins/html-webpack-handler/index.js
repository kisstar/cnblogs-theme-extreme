const fs = require('fs-extra');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { getHeader } = require('../html-webpack-template/template');

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
    await this.insertPresetScript();
    await this.insertPresetStyle();
    this.done(undefined, this.data);
  }

  async insertPresetScript() {
    const { html: htmlString } = this.data;
    const rJQueryScript = /scripts\/jquery[^\n\r]*/;
    const scriptString = await fs.readFile(path.join(__dirname, './preset.js'));

    this.data.html = htmlString.replace(rJQueryScript, `$&\n<script>\n${scriptString}\n</script>`);
  }

  async insertPresetStyle() {
    const { html: htmlString } = this.data;
    const rJQueryStyle = /(<\/head>)/;
    const styleString = await fs.readFile(path.join(__dirname, './preset.css'));

    this.data.html = htmlString.replace(rJQueryStyle, `\n<style>\n${styleString}\n</style>\n$&`);
  }

  // 对于一些无法直接获取的静态资源将其复制到开发服务器的静态目录中，然后修正路径从开发服务器中获取
  async adjustStaticResourceURL() {
    const { html: htmlString } = this.data;
    const rOriginHost = /(https:)?\/\/common\.cnblogs\.com/g;
    const rPicHost = /(src=")(?:https:)?\/\/pic.cnblogs.com(.*.png")/g;
    const rGoogleAds = /[^"]*(adservice|safeframe)\.(google|googlesyndication)\.com[^"]*/g;

    this.data.html = htmlString
      .replace(rOriginHost, '')
      .replace(rPicHost, '$1$2')
      .replace(rGoogleAds, '');
  }

  // 添加顶部导航栏
  async addNavbarTemplate() {
    const { html: htmlString, plugin } = this.data;
    const { options } = plugin;

    if (/public\/index\.html$/.test(options.template)) {
      return;
    }

    const templateString = await getHeader();
    this.data.html = htmlString.replace(/<!--done-->\s*<div id="home">/, `${templateString}$&`);
  }
}

module.exports = HtmlWebpackHandlerPlugin;
