import { IS_POST, PREFIX_CLS } from './config';

if (IS_POST) {
  $('body').addClass(`${PREFIX_CLS}-post`);
}
