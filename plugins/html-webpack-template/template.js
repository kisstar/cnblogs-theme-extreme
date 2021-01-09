const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');
const cnblogsConfig = require('../../config/cnblogs-default');

const resloveTemplate = (name) => path.resolve(__dirname, '../../src/templates', `${name}.hbs`);

async function getHeader() {
  const { username, prefixCls, navbar } = cnblogsConfig;
  const { brand, list } = navbar;
  const navbarContext = {
    username,
    prefixCls,
    title: typeof brand === 'string' ? brand : brand.text,
    logo: brand.logo,
    list,
  };
  const rawString = await fs.readFile(resloveTemplate('navbar'), 'utf8');
  const templateDelegate = Handlebars.compile(rawString);
  const templateString = templateDelegate(navbarContext);

  return templateString;
}

module.exports = {
  getHeader,
};
