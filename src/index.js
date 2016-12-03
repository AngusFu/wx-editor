import './styles.css';
import 'highlight.js/styles/default.css';

import marked from 'marked';
import hljs from 'highlight.js';
const highlight = hljs.highlightBlock;
hljs.configure({ tabReplace: '  '}); 

const create = (tag) => document.createElement(tag);
const getDOM = (s) => document.querySelector(s);
const getAll = (s, target = document) => {
  return Array.prototype.slice.call(target.querySelectorAll(s));
};

export const init = function() {
  const eidtorDOM  = getDOM('.md-editor');
  const previewDOM = getDOM('.md-preview');
  const offlineDIV = create('div');

  const query = (s, cb) => getAll(s, offlineDIV).forEach(el => cb && cb(el));

  eidtorDOM.addEventListener('input', function () {
    let text = this.innerText;
    offlineDIV.innerHTML = marked(text);

    // 处理代码换行
    query('pre', function(pre) {
      highlight(pre);

      let lines = pre.firstElementChild.innerHTML.trim().split('\n');
      
      lines = lines.map((line) => {
        line = line.replace(/(^\s+)/g, m => '&nbsp;'.repeat(m.length));
        return !!line.trim() ? `<p class="line">${line}</p>` : `<p class="lbr"><br></p>`;
      });

      pre.innerHTML = lines.join('');
    });
    
    // 处理行间 code 样式
    query('code', function(code) {
      let span = create('span');
      span.innerHTML = code.innerHTML;
      span.className = 'code';
      code.parentNode.replaceChild(span, code);
    });

    // blockquote 添加类名
    query('blockquote', function(blockquote) {
      blockquote.className = 'blockquote';

      let lines = blockquote.firstElementChild.innerHTML.trim().split('\n');

      lines = lines.map((line) => {
        line = line.replace(/(^\s+)/g, m => '&nbsp;'.repeat(m.length));
        return !!line.trim() ? `<p>${line}</p>` : `<p><br></p>`;
      });
      blockquote.innerHTML = lines.join('');
    });
    
    // 所有 pre 外面包裹一层 blockquote
    // 使用 figure 等标签都不行
    // 会导致微信编辑器中粘贴时会多出一个 p 标签
    query('pre', function(pre) {
      let clone = pre.cloneNode();
      clone.innerHTML = pre.innerHTML;

      let wrap = create('blockquote');
      wrap.className = 'code-wrap';
      wrap.appendChild(clone);

      pre.parentNode.replaceChild(wrap, pre);
    });

    // 处理所有 a 链接
    query('a', function(a) {
      let span = create('span');
      span.innerHTML = a.innerHTML;
      span.className = 'link';
      a.parentNode.replaceChild(span, a);
    });

    // img 处理
    query('img', function(img) {
      img.parentNode.className += 'img-wrap';
    });
    
    previewDOM.innerHTML = offlineDIV.innerHTML;
  });

  // add clip 
  getDOM('#jsCopy').addEventListener('click', function() {
    copy(previewDOM);
  });
};


/**
 * 复制
 * see https://zhuanlan.zhihu.com/p/23920249
 */
function copy(element) {
  let range = document.createRange();
  range.selectNode(element);

  let selection = window.getSelection();
  if(selection.rangeCount > 0) selection.removeAllRanges();
  selection.addRange(range); 
  document.execCommand('copy');
  selection.removeAllRanges();
};

