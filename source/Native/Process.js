/* global */

class Process { // eslint-disable-line
}

class AbortProcess {
}

/* Native Elm interface. */
var _gdotdesign$elm_html$Native_Process = (function () { // eslint-disable-line
  return {
    abort: function () {
      return new AbortProcess()
    }
  }
}()); // eslint-disable-line
