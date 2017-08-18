/* global F2, Fluture */

class Process {
  constructor (method) {
    this.method = method
  }

  call (callback) {
    this.method(callback)
  }
}

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
        xhr.onloadend = function(event) {
          if(xhr.status == 500) {
            reject('Error 500')
          } else if(xhr.status == 404) {
            reject('Error 404')
          } else if(xhr.status != 0) {
            update(xhr.options.onFinish(event.target.responseText))
          }
        }.bind(this)

        xhr.onprogress = function(event){
          update(xhr.options.onProgress({loaded: event.loaded, total: event.total}))
        }.bind(this)

        xhr.onerror = function(event) {
          reject('Unknown Error')
        }

        xhr.upload.onerror = function(event) {
          reject('Upload Error')
        }
      }))
    })
  }

  return {
    fetch: fetch
  }
})(); // eslint-disable-line
