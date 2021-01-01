import { IS_POST, PREFIX_CLS } from '../../config';
import onReady from '../../lib/on-ready';
import './index.scss';

const $blogTitle = $('#blogTitle');
const $topNav = $('#top_nav');

if (IS_POST) {
  const $postInfo = $(`<div class="${PREFIX_CLS}-header-post-info"></div>`);
  $topNav.css({ display: 'none' });
  $blogTitle.append($postInfo.append($('.postTitle')).append($('.postDesc')));

  onReady('#EntryTag', () => {
    $postInfo.append($('#EntryTag'));
  });

  onReady('#profile_block', () => {
    $blogTitle.append($('#profile_block').find('br').remove().end());
  });
} else {
  $blogTitle.append($('#zzk_search')).append($topNav);
}
