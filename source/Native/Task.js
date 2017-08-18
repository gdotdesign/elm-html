/* global F2, FunTask */

var _gdotdesign$elm_html$Native_Task = (function () { // eslint-disable-line
  return {
    timeout: function (delay) {
      return Fluture(function (reject, resolve) {
        setTimeout(function () {
          resolve({})
        }, delay)
      })
    },
    map: F2(function (func, task) {
      return task.map(func)
    }),
    andThen: F2(function(func, task){
      return task.chain(func)
    }),
    reject: null,
    catch: null,
    new: F2(function(resolve, reject){
      Fluture(reject, resolve)
    }),
    succeed: Fluture.of,
    all: null
  }
})(); // eslint-disable-line
