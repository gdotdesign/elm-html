/* global F2, FunTask */

class Cancellation {
  constructor (label) {
    this.label = label
  }

  map (tagger) {
    return this
  }
}

var _gdotdesign$elm_html$Native_Task = (function () { // eslint-disable-line
  return {
    timeout: function (delay) {
      return folktale.concurrency.task.task(function(resolver){
        var id = setTimeout(function(){
          if(!resolver.isCancelled) {
            resolver.resolve({})
          }
        }, delay)

        resolver.cleanup(function(){
          clearTimeout(id)
        })
      })
    },
    label: F2(function (label, task) {
      task.label = label
      return task
    }),
    cancel: function(label){
      return new Cancellation(label)
    },
    map: F2(function (func, task) {
      if (task instanceof Cancellation) {
        return task.map(func)
      } else {
        var newTask = task.map(func)
        newTask.label = task.label
        return newTask
      }
    }),
    andThen: F2(function(func, task){
      return task.chain(func)
    }),
    reject: null,
    catch: null,
    succeed: folktale.concurrency.task.of,
    all: null
  }
})(); // eslint-disable-line
