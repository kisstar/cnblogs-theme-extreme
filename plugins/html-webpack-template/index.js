const { getHeader } = require('./template');

class HtmlWebpackTemplatePlugin {
  apply(compiler) {
    // support compiler.hooks from webpack 4
    if (!compiler.hooks) {
      return;
    }

    compiler.hooks.emit.tapAsync('HtmlWebpackTemplatePlugin', async (compilation, callback) => {
      const htmlString = await getHeader();

      this.compilation = compilation;
      this.compilation.assets['header.html'] = {
        source: () => htmlString,
        size: () => htmlString.length,
      };
      callback();
    });
  }
}

module.exports = HtmlWebpackTemplatePlugin;
