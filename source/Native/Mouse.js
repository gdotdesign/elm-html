/* global Program, F3 */

/* Native Elm interface. */
var _gdotdesign$elm_html$Native_Mouse = (function () { // eslint-disable-line
  let listeners = new Map()

  function map (program, items) {
    listeners.set(program, items)
  }

  window.addEventListener('mousemove', function(event){
    let value = { top: event.pageY, left: event.pageX }

    for (let [program, items] of listeners) {
      for (let [id, msg] of items) {
        program.update(msg(value), id)
      }
    }
  }, { passive: true })

  function moves (msg) {
    return {
      function: map,
      msg: msg
    }
  }

  return {
    moves: moves
  }
}()); // eslint-disable-line
