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

    query('pre', function(pre) {
      highlight(pre);

      let lines = pre.firstElementChild.innerHTML.trim().split('\n');
      
      lines = lines.map((line) => {
        line = line.replace(/(^\s+)/g, m => '&nbsp;'.repeat(m.length));
        return !!line.trim() ? `<p class="line">${line}</p>` : `<p class="lbr"><br></p>`;
      });

      // lines = lines.map((line) => line + '<br>');
      pre.innerHTML = lines.join('');
    });
    
    query('code', function(code) {
      let span = create('span');
      span.innerHTML = code.innerHTML;
      span.className = 'code';
      code.parentNode.replaceChild(span, code);
    });
    
    // 所有 pre 外面包裹一层 div
    query('pre', function(pre) {
      let clone = pre.cloneNode();
      clone.innerHTML = pre.innerHTML;

      let figure = create('section');
      figure.className = 'code-wrap';
      figure.appendChild(clone);

      pre.parentNode.replaceChild(figure, pre);
    });

    query('a', function(a) {
      let span = create('span');
      span.innerHTML = a.innerHTML;
      span.className = 'link';
      a.parentNode.replaceChild(span, a);
    });

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

