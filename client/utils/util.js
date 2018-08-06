const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function promiseify (func) {
  return (args = {}) => {
    return new Promise((resolve, reject) => {
      func.call(wx, Object.assign(args, {
        success: resolve,
        fail: reject,
      }));
    })
  }
}
for (const key in wx) {
  if (Object.prototype.hasOwnProperty.call(wx, key) && typeof wx[key] === 'function') {
    wx[`_${key}`] = promiseify(wx[key]);
  }
}

module.exports = {
  formatTime: formatTime
}
