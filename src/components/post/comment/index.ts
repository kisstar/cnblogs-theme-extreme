import { PREFIX_CLS } from '../../../config';
import './index.scss';

$('.feedbackItem').each(function addAvatar(this: HTMLSpanElement) {
  const $feedbackItem = $(this);
  const avatarURL = $feedbackItem.find('span[id*="_avatar"]').text().trim();
  const commentAuthorURL = $feedbackItem.find('a[id*="a_comment_author_"]').attr('href');
  const avatarHTML = `
    <div class="${PREFIX_CLS}-comment-avatar">
      <a href="${commentAuthorURL}" target="_blank">
        <img src="${avatarURL}" alt="avatar" />
      </a>
    </div>
  `;

  $feedbackItem.prepend($(avatarHTML));
});
