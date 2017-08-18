/* global F2, FunTask */

class Process {
  constructor (method) {
    this.method = method
  }

  call (callback) {
    return this.method(callback)
  }
}

var _gdotdesign$elm_html$Native_Task = (function () { // eslint-disable-line
  return {
    cancel: function(process) {
      process.cancel()
    }
  }
})(); // eslint-disable-line
