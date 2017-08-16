/* global Program, _gdotdesign$elm_html$Native_Uid */

/* Native Elm interface. */
var _gdotdesign$elm_html$Native_Html = (function () { // eslint-disable-line
  function program (tree) {
    return function () {
      return function (object) {
        object.fullscreen = function () {
          window.program = new Program(tree)
        }
      }
    }
  }

  function component (comp) {
    comp.uid = _gdotdesign$elm_html$Native_Uid.uid()
    return comp
  }

  return {
    component: component,
    program: program
  }
}())
