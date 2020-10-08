import './index.scss';

function addDigg($toolbar: JQuery): void {
  const $digg = $('#div_digg');

  $toolbar.append($digg);
}

export default addDigg;
