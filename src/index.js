import './styles.css';
import 'highlight.js/styles/default.css';

import marked from 'marked';
import hljs from 'highlight.js';
const highlight = hljs.highlightBlock;

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

    query('pre', function(pre) {
      highlight(pre);
      let lines = pre.firstElementChild.innerHTML.split('\n');
      lines = lines.map((line) => `<div class="line">${line}</div>`);
      pre.innerHTML = lines.join('');
    });
    
    query('code', function(code) {
      let span = create('span');
      span.innerHTML = code.innerHTML;
      span.className = 'code';
      code.parentNode.replaceChild(span, code);
    });

    query('a', function(a) {
      let span = create('span');
      span.innerHTML = a.innerHTML;
      span.className = 'link';
      a.parentNode.replaceChild(span, a);
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

