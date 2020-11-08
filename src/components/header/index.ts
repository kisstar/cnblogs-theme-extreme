import { IS_POST, PREFIX_CLS } from '../../config';
import { ensureAsync } from '../../lib/utils';
import './index.scss';

const $blogTitle = $('#blogTitle');
const $topNav = $('#top_nav');

if (IS_POST) {
  const $postInfo = $(`<div class="${PREFIX_CLS}-header-post-info"></div>`);
  $topNav.css({ display: 'none' });
  $blogTitle.append($postInfo.append($('.postTitle')).append($('.postDesc')));

  ensureAsync(
    () => {
      return !!$('#EntryTag')[0];
    },
    () => {
      $postInfo.append($('#EntryTag'));
    },
  );

  ensureAsync(
    () => {
      return !!$('#profile_block')[0];
    },
    () => {
      $blogTitle.append($('#profile_block').find('br').remove().end());
    },
  );
} else {
  $blogTitle.append($('#zzk_search')).append($topNav);
}
