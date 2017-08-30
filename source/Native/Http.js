/* global Process, _elm_lang$core$Native_List */

class HttpProcess extends Process {
  constructor (options) {
    super()
    this.options = options

    this.initialize()
    this.setHeaders()

    this.xhr.onload = this.onLoaded.bind(this)

    if (options.onProgress.ctor === 'Just') {
      this.xhr.onprogress = this.onProgress.bind(this)
    }
  }

  onProgress (event) {
    this.update(this.options.onProgress._0({
      transferredBytes: event.loaded,
      totalBytes: event.total
    }))
  }

  onLoaded (event) {
    if (this.xhr.status === 500) {
      // TODO: error handling
    } else if (this.xhr.status === 404) {
      // TODO: error handling
    } else if (this.xhr.status !== 0) {
      this.update(this.options.onFinish(event.target.responseText))
    }
    this.finish()
  }

  initialize () {
    this.xhr = new XMLHttpRequest()
    this.xhr.open(this.options.method, this.options.url)
    this.xhr.withCredentials = this.options.withCredentials
  }

  setHeaders () {
    var headers = _elm_lang$core$Native_List.toArray(this.options.headers)
    for (var item of headers) {
      this.xhr.setRequestHeader(item._0, item._1)
    }
  }

  get body () {
    switch (this.options.body.ctor) {
      case 'StringBody':
        return this.options.body._0
    }
  }

  run (update, finish) {
    this.update = update
    this.finish = finish

    this.xhr.send(this.body)
  }

  abort () {
    this.xhr.abort()
    this.finish()
  }
}

var _gdotdesign$elm_html$Native_Http = (function () { // eslint-disable-line
  var send = function (options) {
    return function () {
      return new HttpProcess(options)
    }
  }

  return {
    send: send
  }
})(); // eslint-disable-line
