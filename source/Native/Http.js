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
    return Fluture( function(reject, resolve) {
      var xhr = new XMLHttpRequest()
      xhr.open(options.method, options.url)
      xhr.withCredentials = options.withCredentials

      var headers = _elm_lang$core$Native_List.toArray(options.headers)
      for (var item of headers) {
        xhr.setRequestHeader(item._0, item._1)
      }

      xhr.onloadend = function(event) {
        if(xhr.status == 500) {
          reject('Error 500')
        } else if(xhr.status == 404) {
          reject('Error 404')
        } else if(xhr.status != 0) {
          resolve(event.target.responseText)
        }
      }

      xhr.onerror = function(event) {
        reject('Unknown Error')
      }

      xhr.upload.onerror = function(event) {
        reject('Upload Error')
      }

      /* TODO: Handle Progress
      if (xhr.upload && opts.onprogress) {
        xhr.upload.onprogress = opts.on_progress
      }
      */

      xhr.send(options.body)

      return function(){ xhr.abort }
    })
  }

  return {
    fetch: fetch
  }
})(); // eslint-disable-line
