import marked from 'marked';

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
};

