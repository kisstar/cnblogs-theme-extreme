import { PREFIX_CLS, BRAND, IS_POST, USER_INFO } from '../../config';
import onReady from '../../lib/on-ready';
import './index.scss';

const htmlTemplate = `
  <a class="${PREFIX_CLS}-sidebar-brand" href="/${USER_INFO.username}">
    <img src="${BRAND.logo}" width="30" height="30">
    ${BRAND.text}
  </a>`;
const $navigator = $('#navigator');
// const $navList = $('#navList');

// 添加个人信息
if (IS_POST) {
  onReady('#author_profile', `.${PREFIX_CLS}-sidebar-brand`, () => {
    $('#author_profile').insertAfter($(`.${PREFIX_CLS}-sidebar-brand`));
  });
} else {
  $('#sidebar_news').prependTo($navigator);
}

// 向侧边栏添加 LOGO 和标题
$(htmlTemplate).prependTo($navigator);

// 控制侧边栏的显示
$navigator.click(function handleClick() {
  $('#home').toggleClass(`${PREFIX_CLS}-sidebar-open`);
});
