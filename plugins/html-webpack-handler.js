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
    // webpack 4 support
    if (compiler.hooks) {
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
  }

  async run() {
    await this.addNavbarTemplate();
    this.done(undefined, this.data);
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

    this.data.html = htmlString.replace(/<!--done-->\s<div id="home">/, `${templateString}$&`);
    if (process.env.NODE_ENV === 'production') {
      this.data.html = templateString;
    }
  }
}

module.exports = HtmlWebpackHandlerPlugin;
