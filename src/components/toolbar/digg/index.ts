import onReady from '../../../lib/on-ready';
import './index.scss';

function addDigg($toolbar: JQuery): void {
  onReady('#author_profile', () => {
    const $digg = $('#div_digg');
    $toolbar.append($digg);
  });
}

export default addDigg;
