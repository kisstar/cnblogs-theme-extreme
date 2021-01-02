import { PREFIX_CLS, DEFAULT_AVATAR } from '../../../config';
import './index.scss';

function adjustComment() {
  $('.feedbackItem').each(function addAvatar(_idx, item) {
    const $feedbackItem = $(item);
    const $commentBody = $feedbackItem.find('.blog_comment_body');

    // 移除删除的评论
    if (!$commentBody.html()) {
      $feedbackItem.remove();
      return;
    }

    const $avatar = $feedbackItem.find(`.${PREFIX_CLS}-comment-avatar`);

    // 已经添加过的则不再处理
    if ($avatar.get(0)) {
      return;
    }

    const avatarURL = $feedbackItem.find('span[id*="_avatar"]').text().trim();
    const commentAuthorURL = $feedbackItem.find('a[id*="a_comment_author_"]').attr('href');
    const avatarHTML = `
      <div class="${PREFIX_CLS}-comment-avatar">
        <a href="${commentAuthorURL}" target="_blank">
          <img src="${avatarURL || DEFAULT_AVATAR}" alt="avatar" />
        </a>
      </div>
    `;

    $feedbackItem.prepend($(avatarHTML));
  });
}

function adjustNewComment() {
  $('.new-comment-block').each(function addAvatar(_idx, item) {
    const $blockItem = $(item);
    const $avatar = $blockItem.find(`.${PREFIX_CLS}-comment-avatar`);

    // 已经添加过的则不再处理
    if ($avatar.get(0)) {
      return;
    }

    const avatarURL = $blockItem.find('span[id*="_avatar"]').text().trim();
    const commentAuthorURL = $blockItem.find('a').attr('href');
    const avatarHTML = `
      <div class="${PREFIX_CLS}-comment-avatar">
        <a href="${commentAuthorURL}" target="_blank">
          <img src="${avatarURL || DEFAULT_AVATAR}" alt="avatar" />
        </a>
      </div>
    `;

    $blockItem.find('.new-comment-title').prepend($(avatarHTML));
  });
}

$(document).ajaxSuccess(
  (_event: JQueryEventObject, _XMLHttpRequest: XMLHttpRequest, ajaxOptions: JQueryAjaxSettings) => {
    const url = ajaxOptions.url || '';

    // q: 使用 ajax/PostComment/Add.aspx 会崩掉
    if (url.includes('PostComment/Add.aspx')) {
      window.RefreshCommentList();
    }

    // 删除评论时重新调整评论列表
    if (url.includes('comment/DeleteComment.aspx')) {
      adjustComment();
    }

    // 添加评论后重新调整评论列表
    if (url.includes('comment/NewComments.aspx')) {
      adjustNewComment();
    }
  },
);

adjustComment();
