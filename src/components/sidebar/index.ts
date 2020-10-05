import { PREFIX_CLS, BRAND } from '../../config';
import './index.scss';

const htmlTemplate = `
<a class="${PREFIX_CLS}-sidebar-brand" href="#">
  <img src="${BRAND.logo}" width="30" height="30">
  ${BRAND.text}
</a>`;

// 向侧边栏添加 LOGO 和标题
$(htmlTemplate).insertBefore($('#navList').children().first());
// 控制侧边栏的显示
$('#navigator').click(function handleClick() {
  $('#home').toggleClass(`${PREFIX_CLS}-sidebar-open`);
});
