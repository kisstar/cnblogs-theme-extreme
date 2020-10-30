import { IS_POST, PREFIX_CLS } from '../../config';
import './index.scss';

const $blogTitle = $('#blogTitle');
const $topNav = $('#top_nav');

if (IS_POST) {
  const $postInfo = $(`<div class="${PREFIX_CLS}-header-post-info"></div>`);
  $topNav.css({ display: 'none' });
  $blogTitle
    .append($postInfo.append($('.postTitle')).append($('.postDesc')).append($('#BlogPostCategory')))
    .append($('#profile_block').find('br').remove().end());
} else {
  $blogTitle.append($('#zzk_search')).append($topNav);
}
