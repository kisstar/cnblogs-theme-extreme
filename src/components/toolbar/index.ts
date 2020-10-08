import { PREFIX_CLS } from '../../config';
import addBackTop from './back-top';
import './index.scss';

const $toolbar = $(`<div class="${PREFIX_CLS}-toolbar-container"></div>`);

$toolbar.appendTo($('body'));

addBackTop($toolbar);
