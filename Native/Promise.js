var _gdotdesign$elm_html$Native_Promise = (function () {
  var init = function(resolve, reject) {
    return new Promise(resolve, reject)
  }

  return {
    resolve: function(value) { return Promise.resolve(value) },
    timeout: function(delay) { return new Promise(function(resolve){
      setTimeout(function(){
        resolve()
      }, delay)
    })},
    reject: null,
    catch: null,
    new: init,
    map: F2(function(func,promise) { return promise.then(func) }),
    all: null
  }
})()
