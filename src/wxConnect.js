
const wxEditorUrlPattern = 'https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit*';

/**
 * 检测有无微信编辑器窗口打开
 * 如果没有 则默认打开微信公众号首页
 * 
 * @param  {Object} message
 */
function sendMessage(message) {
  return {
    to: function (url) {
      return new Promise(function (resolve, reject) {
        chrome.tabs.query({ url }, tabs => {
          if (!tabs.length) reject();
          chrome.tabs.sendMessage(
            tabs[0].id,
            Object.assign(message || {}, { from: location.href })
          );
          resolve();
        });
      });
    }
  };
};


/**
 * 找不到微信窗口
 */
function wxPageNotFound() {
  alert('请打开微信公众号编辑页面后再进行操作！');
  chrome.tabs.create({ url: 'https://mp.weixin.qq.com/', selected: true });
}


/**
 * 首先确认有无微信编辑器被打开 以方便上传图片
 */
export function confirmWXConnection() {
  sendMessage({ type: 'comfirm', from: location.href })
    .to(wxEditorUrlPattern)
    .catch(wxPageNotFound)
    .then(function () {
      // 添加监听器 
      chrome.runtime.onMessage.addListener(function (message) {
        if (message.type === 'comfirm' && message.state === 1) {
          console.info('微信页面状态连接已确认正常');
        }
      });
    });
}

/**
 * 注入通知
 */
export function wxInject(html) {
  sendMessage({
    type: 'inject',
    html
  }).to(wxEditorUrlPattern);
}


