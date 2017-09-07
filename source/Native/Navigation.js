var _gdotdesign$elm_html$Native_Navigation = (function () { // eslint-disable-line
  function getLocation () {
    return {
      protocol: window.location.protocol,
      host: window.location.host,
      hostname: window.location.hostname,
      port: window.location.port,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash
    }
  }

  function notifyListeners() {
    let location = getLocation()

    for (let [program, items] of listeners) {
      for (let [id, msg] of items) {
        program.update(msg(location), id)
      }
    }
  }

  window.addEventListener('popstate', function () {
    notifyListeners()
  })

  let listeners = new Map()

  function map (program, items) {
    listeners.set(program, items)
  }

  function changes (msg) {
    return {
      function: map,
      msg: msg
    }
  }

  return {
    navigate: function(pathname){
      return Fluture(function(reject, resolve){
        let previousLocation = getLocation()

        window.history.pushState({}, '', pathname)

        if (!_elm_lang$core$Native_Utils.eq(previousLocation, getLocation())){
          notifyListeners()
        }

        resolve(null)
      })
    },
    location: getLocation,
    changes: changes
  }
}()); // eslint-disable-line
