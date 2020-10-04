import { PREFIX_CLS } from '../../config';
import './index.scss';

// 控制在移动端下菜单项的显示
$(`.${PREFIX_CLS}-navbar-toggler`).click(function handleClick() {
  const $navbarCollapse = $(`.${PREFIX_CLS}-navbar-collapse`);
  const $body = $('body');

  if (!$navbarCollapse.hasClass(`${PREFIX_CLS}-navbar-show`)) {
    const height = Math.min($navbarCollapse.height(), document.documentElement.clientHeight);
    $navbarCollapse.height(0);
    $navbarCollapse.addClass(`${PREFIX_CLS}-navbar-show`);
    $navbarCollapse.animate({ height }, 500);
    $body.addClass('no-scroll'); // 防止页面滚动(滚动穿透)
  } else {
    $body.removeClass('no-scroll');
    $navbarCollapse.animate({ height: 0 }, 500, function handleEffect() {
      $navbarCollapse.removeClass(`${PREFIX_CLS}-navbar-show`);
      ($navbarCollapse.get(0) as HTMLDivElement).style.height = '';
    });
  }
});
