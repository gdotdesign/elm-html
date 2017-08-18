/* global F2, Fluture */

var _gdotdesign$elm_html$Native_Http = (function () { // eslint-disable-line
  /*
    options:
      - method : String
      - url : String
      - headers : (String, String)
      - withCredentials : String
      - body : String
  */
  var fetch = function (options) {
    return Fluture(function(reject, resolve) {
      var xhr = new XMLHttpRequest()
      xhr.open(options.method, options.url)
      xhr.withCredentials = options.withCredentials

      var headers = _elm_lang$core$Native_List.toArray(options.headers)
      for (var item of headers) {
        xhr.setRequestHeader(item._0, item._1)
      }

      /*
      if (xhr.upload && options.onUploadProgress) {
        xhr.upload.onprogress = options.onUploadProgress
      }
      */

      xhr.send(options.body)
      xhr.options = options

      resolve(new Process(function(update){
        return Fluture(function(rej, res){
          xhr.onloadend = function(event) {
            if(xhr.status == 500) {
            } else if(xhr.status == 404) {
            } else if(xhr.status != 0) {
              update(xhr.options.onFinish(event.target.responseText))
            }
            res("")
          }.bind(this)

          xhr.onprogress = function(event){
            update(xhr.options.onProgress({loaded: event.loaded, total: event.total}))
          }.bind(this)

          xhr.onerror = function(event) {
            res("")
          }

          xhr.upload.onerror = function(event) {
            res("")
          }

          return () => { xhr.abort() }
        })
      }))
    })
  }

  return {
    fetch: fetch
  }
})(); // eslint-disable-line
