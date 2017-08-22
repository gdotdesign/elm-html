/* global F2, Fluture */

var _gdotdesign$elm_html$Native_Task = (function () { // eslint-disable-line
  return {
    timeout: F2(function (delay, value) {
      return Fluture.after(delay, value)
    }),

    map: F2(function (func, task) {
      return task.map(func)
    }),

    chain: F2(function (func, task) {
      return task.chain(func)
    }),

    succeed: function (value) {
      return Fluture.of(value)
    }
  }
})(); // eslint-disable-line
