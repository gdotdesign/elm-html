/* global Process, _elm_lang$core$Native_List, _gdotdesign$elm_html$Rumble_Http$LoadedWithTotal, _gdotdesign$elm_html$Rumble_Http$Loaded */

class HttpProcess extends Process {
  constructor (options) {
    super()
    this.options = options
    this.aborted = false

    this.initialize()
    this.setHeaders()

    this.xhr.onload = this.onLoaded.bind(this)

    if (this.options.onProgress.ctor === 'Just') {
      this.xhr.onprogress = this.onProgress.bind(this)
    }
  }

  onProgress (event) {
    if (this.aborted) { return }

    if (event.lengthComputable) {
      this.update(
        this.options.onProgress._0(
          _gdotdesign$elm_html$Rumble_Http$LoadedWithTotal(event.loaded)(event.total)
        )
      )
    } else {
      this.update(
        this.options.onProgress._0(
          _gdotdesign$elm_html$Rumble_Http$Loaded(event.loaded)
        )
      )
    }
  }

  onLoaded (event) {
    if (this.xhr.status === 500) {
      // TODO: error handling
    } else if (this.xhr.status === 404) {
      // TODO: error handling
    } else if (this.xhr.status !== 0) {
      if (this.options.onLoad.ctor === 'Just') {
        this.update(
          this.options.onLoad._0(event.target.responseText))
      }
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
    this.aborted = true
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
