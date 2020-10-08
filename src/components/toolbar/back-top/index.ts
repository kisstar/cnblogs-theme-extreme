import { PREFIX_CLS } from '../../../config';
import './index.scss';

function addBackTop($toolbar: JQuery): void {
  const $backTopButton = $(`
    <button class="${PREFIX_CLS}-backtop">
      <svg
        t="1602157430166"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3560"
        fill="currentColor"
      >
        <path d="M511.104 287.872 959.36 734.976 512.32 489.344 64.64 736.128Z" p-id="3561"></path>
      </svg>
    </button>`);

  $toolbar.prepend($backTopButton);
  $backTopButton.click(function scrollToTop() {
    $('html, body').animate({ scrollTop: 0 }, 500);
  });
}

export default addBackTop;
