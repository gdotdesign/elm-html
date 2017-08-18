/* global F2, FunTask */

var _gdotdesign$elm_html$Native_Task = (function () { // eslint-disable-line
  return {
    timeout: function (delay) {
      return FunTask.create(function (resolve) {
        setTimeout(function () {
          resolve()
        }, delay)
      })
    },
    andThen: F2(function (func, task) {
      return task.map(func)
    }),
    reject: null,
    catch: null,
    new: FunTask.create,
    succeed: FunTask.of,
    all: null
  }
})(); // eslint-disable-line
