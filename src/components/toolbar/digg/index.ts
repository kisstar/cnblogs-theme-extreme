import { ensureAsync } from '../../../lib/utils';
import './index.scss';

function addDigg($toolbar: JQuery): void {
  ensureAsync(
    () => {
      return !!$('#author_profile')[0];
    },
    () => {
      const $digg = $('#div_digg');
      $toolbar.append($digg);
    },
  );
}

export default addDigg;
