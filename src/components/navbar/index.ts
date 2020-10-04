import { PREFIX_CLS } from '../../config';
import { throttle } from '../../lib/utils';
import './index.scss';

(function IIFE() {
  // 控制在移动端下菜单项的显示
  $(`.${PREFIX_CLS}-navbar-toggler`).click(function handleClick() {
    const $body = $('body');
    const $navbarCollapse = $(`.${PREFIX_CLS}-navbar-collapse`);
    const navbarCollapseElement = $navbarCollapse.get(0) as HTMLDivElement;

    if (!$navbarCollapse.hasClass(`${PREFIX_CLS}-navbar-show`)) {
      const height = Math.min($navbarCollapse.height(), document.documentElement.clientHeight);
      $navbarCollapse.height(0);
      $navbarCollapse.addClass(`${PREFIX_CLS}-navbar-show`);
      $navbarCollapse.animate({ height }, 500, () => {
        navbarCollapseElement.style.height = '';
      });
      $body.addClass('no-scroll'); // 防止页面滚动(滚动穿透)
    } else {
      $body.removeClass('no-scroll');
      $navbarCollapse.animate({ height: 0 }, 500, () => {
        $navbarCollapse.removeClass(`${PREFIX_CLS}-navbar-show`);
        navbarCollapseElement.style.height = '';
      });
    }
  });

  // 向下滚动隐藏，反向则显示
  let oldTop = 0;
  $(window).scroll(
    throttle(function handleScroll() {
      const scrollingElement = document.scrollingElement || document.body;
      const newTop = scrollingElement.scrollTop;
      const $navbar = $(`.${PREFIX_CLS}-navbar`);

      if (newTop > oldTop && newTop > 64) {
        $navbar.slideUp();
      } else {
        $navbar.slideDown();
      }
      oldTop = newTop;
    }, 24),
  );
})();
