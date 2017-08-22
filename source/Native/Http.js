/* global Fluture, _elm_lang$core$Native_List */

var _gdotdesign$elm_html$Native_Http = (function () { // eslint-disable-line
  /*
    options:
      - method : String
      - url : String
      - headers : (String, String)
      - withCredentials : String
      - body : String
  */

  var send = function (options) {
    return Fluture(function (reject, resolve) {
      var xhr = new XMLHttpRequest()
      xhr.open(options.method, options.url)
      xhr.withCredentials = options.withCredentials

      var headers = _elm_lang$core$Native_List.toArray(options.headers)
      for (var item of headers) {
        xhr.setRequestHeader(item._0, item._1)
      }

      var body
      switch (options.body.ctor) {
        case 'StringBody':
          body = options.body._0
      }

      xhr.send(body)
      xhr.options = options

      xhr.onloadend = function (event) {
        if (xhr.status === 500) {
        } else if (xhr.status === 404) {
        } else if (xhr.status !== 0) {
          resolve(xhr.options.onFinish(event.target.responseText))
        }
      }

      switch (xhr.options.onProgress.ctor) {
        case 'Just':
          xhr.onprogress = function (event) {
            /* update(xhr.options.onProgress._0({
              transferredBytes: event.loaded,
              totalBytes: event.total
            })) */
          }
      }

      switch (xhr.options.onUploadProgress.ctor) {
        case 'Just':
          if (xhr.upload) {
            xhr.upload.onprogress = function (event) {
              /* update(xhr.options.onUploadProgress._0({
                loaded: event.loaded,
                total: event.total
              })) */
            }
          }
      }

      xhr.onerror = function (event) {
      }

      xhr.upload.onerror = function (event) {
      }
    })
  }

  return {
    send: send
  }
})(); // eslint-disable-line
