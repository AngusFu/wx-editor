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
    
    query('code', function (code) {
      let span = create('span');
      span.innerHTML = code.innerHTML;
      code.parentNode.replaceChild(span, code);
    });
    
    previewDOM.innerHTML = offlineDIV.innerHTML;
  });
};

