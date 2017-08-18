/* global Program, F3 */

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

  function component (comp, id, listener) {
    return {
      update: comp.update,
      listener: listener,
      model: comp.model,
      view: comp.view,
      id: id
    }
  }

  function controlledComponent (comp, model, listener) {
    return {
      update: comp.update,
      listener: listener,
      view: comp.view,
      model: model
    }
  }

  return {
    controlledComponent: F3(controlledComponent),
    component: F3(component),
    program: program
  }
}()); // eslint-disable-line