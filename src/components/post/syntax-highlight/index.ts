import { PREFIX_CLS } from '../../../config';
import { copy, noop } from '../../../lib/utils';
import message from '../../message';
import './index.scss';

// 在默认的样式中 .cnblogs-markdown 下的样式更多的是对代码样式进行修饰
// 所以在自定义代码主题样式时我们可以直接禁用这个 class 下的样式，比如直接移除它
$('#cnblogs_post_body').removeClass('cnblogs-markdown');

// 在每一行代码的行首加上 <span class="ln-num" data-num="xxx"></span> 标签
// 然后通过 CSS 设置 ::before 伪元素 content:attr(data-num) 显示行号

function createLineNumber(input: string): string {
  let number = 1;
  let output = input;

  // if (/\r|\n$/.test(input.replace(/<span[^>]*>|<\/span>/g, ''))) {
  //   output += '<span class="ln-eof"></span>';
  // }

  // 在行尾插入 <span class="ln-num" data-num="xxx"></span> 标签
  output = output.replace(/\r?\n/g, function insertLineNumber(matched) {
    number += 1;
    return `${matched}<span class="${PREFIX_CLS}-code-ln-num" data-num="${number}"></span>`;
  });

  // 换行符对应插入了下一行的行号，所以第一行需再手动添加
  output = `<span class="${PREFIX_CLS}-code-ln-num" data-num="1"></span>${output}`;

  return output;
}

function addLineNumber(): void {
  const $codeList = $('code.hljs');
  if ($codeList.length === 0) {
    return;
  }

  $.each($codeList, (_, code) => {
    const $code = $(code);

    // 如果包含 .hljs-ln 说明已经过处理
    if ($code.hasClass(`${PREFIX_CLS}-code-hljs-ln`)) {
      return;
    }

    // 读取代码块添加行号后写入页面
    $code
      .html(createLineNumber($code.html()))
      .addClass(`${PREFIX_CLS}-code-hljs-ln`)
      // 正如前所述，换行符对应插入了下一行的行号，所以最后一个换行符总是会产生一个空白行
      .find('span[data-num]:last')
      .remove();
  });
}

function supportReplication() {
  const codeCopyButtonClass = `${PREFIX_CLS}-code-copy-btn`;

  $('code.hljs')
    .parent()
    .addClass(`${PREFIX_CLS}-code-container`)
    .append($(`<span class="${codeCopyButtonClass}">复制代码</span>`));
  $(`.${codeCopyButtonClass}`).click(function handleClick(this: HTMLSpanElement) {
    copy($(this).prev().text())
      .then(() => {
        // 如果有的话应该使用 message 模块进行提示
        message.success('复制成功');
        return true;
      })
      .catch(noop);
  });
}

addLineNumber();
supportReplication();
