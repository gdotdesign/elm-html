/* global Program, F2 */

/* Native Elm interface. */
var _gdotdesign$elm_html$Native_Html = (function () { // eslint-disable-line
  function program (initialMsg, tree) {
    return function () {
      return function (object) {
        object.fullscreen = function () {
          window.program = new Program(tree, initialMsg)
        }
      }
    }
  }

  function component (data) {
    return {
      subscriptions: data.component.subscriptions,
      initialState: data.component.initialState,
      update: data.component.update,
      view: data.component.view,
      props: data.props,
      id: data.id
    }
  }

  return {
    foreign: F2(function (props, component) { return { props: props, component: component } }),
    embed: function (value) { return value },
    component: component,
    program: F2(program)
  }
}()); // eslint-disable-line
