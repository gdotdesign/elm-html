(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.FunTask = factory());
}(this, (function () { 'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module) {
(function() {

  'use strict';

  var mapping = {
    equals: 'fantasy-land/equals',
    concat: 'fantasy-land/concat',
    empty: 'fantasy-land/empty',
    map: 'fantasy-land/map',
    ap: 'fantasy-land/ap',
    of: 'fantasy-land/of',
    reduce: 'fantasy-land/reduce',
    traverse: 'fantasy-land/traverse',
    chain: 'fantasy-land/chain',
    chainRec: 'fantasy-land/chainRec',
    extend: 'fantasy-land/extend',
    extract: 'fantasy-land/extract',
    bimap: 'fantasy-land/bimap',
    promap: 'fantasy-land/promap'
  };

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = mapping;
  } else {
    self.FantasyLand = mapping;
  }

}());
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var chainRecNext = function chainRecNext(x) {
  return { type: 'next', value: x };
};
var chainRecDone = function chainRecDone(x) {
  return { type: 'done', value: x };
};

var defaultFailureHandler = function defaultFailureHandler(failure) {
  if (failure instanceof Error) {
    throw failure;
  } else {
    throw new Error('Unhandled task failure: ' + String(failure));
  }
};
var noop = function noop() {};

var runHelper = function runHelper(body, handlers) {
  var success = handlers.success;
  var failure = handlers.failure;
  var catch_ = handlers.catch;

  var onCancel = noop;
  var onClose = noop;
  var _close = function close() {
    onClose();
    // The idea here is to kill links to all stuff that we exposed from runHelper closure.
    // We expose via the return value (cancelation function) and by passing callbacks to the body.
    // We reason from an assumption that outer code may keep links to values that we exposed forever.
    // So we look at all things that referenced in the exposed callbacks and kill them.
    success = noop;
    failure = noop;
    catch_ = noop;
    onCancel = noop;
    _close = noop;
  };
  var bodyReturn = body(function (x) {
    var s = success;
    _close();
    s(x);
  }, function (x) {
    var f = failure;
    _close();
    f(x);
  }, catch_ && function (x) {
    var c = catch_;
    _close();
    c(x);
  });
  onCancel = bodyReturn.onCancel || noop;
  onClose = bodyReturn.onClose || noop;
  if (_close === noop) {
    onCancel = noop;
    onClose();
  }
  return function () {
    onCancel();_close();
  };
};

function isTask(maybeTask) {
  return maybeTask instanceof Task;
}

function isFun(maybeFunction) {
  return typeof maybeFunction === 'function';
}

function isArrayOfTasks(maybeArray) {
  if (!Array.isArray(maybeArray)) {
    return false;
  }
  for (var i = 0; i < maybeArray.length; i++) {
    if (!(maybeArray[i] instanceof Task)) {
      return false;
    }
  }
  return true;
}

function isThenableOrFn(maybeThenable) {
  return typeof maybeThenable === 'function' || (typeof maybeThenable === 'undefined' ? 'undefined' : _typeof(maybeThenable)) === 'object' && maybeThenable !== null && typeof maybeThenable.then === 'function';
}

function inv(shouldBeTrue, errorMessage, actualValue) {
  if (!shouldBeTrue) {
    throw new TypeError(errorMessage + '. Actual value: ' + actualValue);
  }
}

var Task = function () {
  function Task() {
    classCallCheck(this, Task);

    if (this.constructor === Task) {
      throw new Error('Don\'t call `new Task()`, call `Task.create()` instead');
    }
  }

  // Creates a task with an arbitrary computation


  createClass(Task, [{
    key: 'map',
    value: function map(fn) {
      inv(isFun(fn), 'task.map(f): f is not a function', fn);
      return new Map(this, fn);
    }

    // Transforms a task by applying `fn` to the failure value

  }, {
    key: 'mapRejected',
    value: function mapRejected(fn) {
      inv(isFun(fn), 'task.mapRejected(f): f is not a function', fn);
      return new MapRejected(this, fn);
    }

    // Transforms a task by applying `sf` to the successful value or `ff` to the failure value

  }, {
    key: 'bimap',
    value: function bimap(ff, fs) {
      inv(isFun(ff), 'task.bimap(f, _): f is not a function', ff);
      inv(isFun(fs), 'task.bimap(_, f): f is not a function', fs);
      return this.map(fs).mapRejected(ff);
    }

    // Transforms a task by applying `fn` to the successful value, where `fn` returns a Task

  }, {
    key: 'chain',
    value: function chain(fn) {
      inv(isFun(fn), 'task.chain(f): f is not a function', fn);
      return new Chain(this, fn);
    }

    // Transforms a task by applying `fn` to the failure value, where `fn` returns a Task

  }, {
    key: 'orElse',
    value: function orElse(fn) {
      inv(isFun(fn), 'task.orElse(f): f is not a function', fn);
      return new OrElse(this, fn);
    }
  }, {
    key: 'recur',
    value: function recur(fn) {
      inv(isFun(fn), 'task.recur(f): f is not a function', fn);
      return new Recur(this, fn);
    }
  }, {
    key: 'ap',
    value: function ap(otherTask) {
      var _this = this;

      inv(isTask(otherTask), 'task.ap(t): t is not a task', otherTask);
      return otherTask.chain(function (f) {
        return _this.map(function (x) {
          return f(x);
        });
      });
    }

    // Selects the earlier of the two tasks

  }, {
    key: 'concat',
    value: function concat(otherTask) {
      inv(isTask(otherTask), 'task.concat(t): t is not a task', otherTask);
      return Task.race([this, otherTask]);
    }
  }, {
    key: '_run',
    value: function _run(handlers) {
      // eslint-disable-line
      throw new Error('Method run() is not implemented in basic Task class.');
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return '<abstract>';
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'Task.' + this._toString();
    }
  }, {
    key: 'run',
    value: function run(h) {
      var handlers = typeof h === 'function' ? { success: h, failure: defaultFailureHandler } : { success: h.success || noop, failure: h.failure || defaultFailureHandler, catch: h.catch };
      return this._run(handlers);
    }
  }, {
    key: 'toPromise',
    value: function toPromise() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { catch: true };

      return new Promise(function (suc, err) {
        _this2.run({
          success: function success(x) {
            suc({ success: x });
          },
          failure: function failure(x) {
            suc({ failure: x });
          },

          catch: options.catch ? err : undefined
        });
      });
    }
  }, {
    key: 'runAndLog',
    value: function runAndLog() {
      this.run({
        success: function success(x) {
          console.log('Success:', x);
        },
        // eslint-disable-line
        failure: function failure(x) {
          console.log('Failure:', x);
        }
      });
    }
  }], [{
    key: 'create',
    value: function create(computation) {
      inv(isFun(computation), 'Task.create(f): f is not a function', computation);
      return new FromComputation(computation);
    }

    // Creates a task that resolves with a given value

  }, {
    key: 'of',
    value: function of(value) {
      return new Of(value);
    }

    // Creates a task that fails with a given error

  }, {
    key: 'rejected',
    value: function rejected(error) {
      return new Rejected(error);
    }

    // Creates a task that never completes

  }, {
    key: 'empty',
    value: function empty() {
      return new Empty();
    }

    // Given array of tasks creates a task of array

  }, {
    key: 'parallel',
    value: function parallel(tasks) {
      inv(isArrayOfTasks(tasks), 'Task.parallel(a): a is not an array of tasks', tasks);
      return new Parallel(tasks);
    }

    // Given array of tasks creates a task that completes with the earliest value or error

  }, {
    key: 'race',
    value: function race(tasks) {
      inv(isArrayOfTasks(tasks), 'Task.race(a): a is not an array of tasks', tasks);
      return new Race(tasks);
    }

    // Transforms a task by applying `fn` to the successful value

  }, {
    key: 'map',
    value: function map(fn, task) {
      inv(isFun(fn), 'Task.map(f, _): f is not a function', fn);
      inv(isTask(task), 'Task.map(_, t): t is not a task', task);
      return new Map(task, fn);
    }
  }, {
    key: 'mapRejected',
    value: function mapRejected(fn, task) {
      inv(isFun(fn), 'Task.mapRejected(f, _): f is not a function', fn);
      inv(isTask(task), 'Task.mapRejected(_, t): t is not a task', task);
      return new MapRejected(task, fn);
    }
  }, {
    key: 'bimap',
    value: function bimap(ff, fs, task) {
      inv(isFun(ff), 'Task.bimap(f, _, _): f is not a function', ff);
      inv(isFun(fs), 'Task.bimap(_, f, _): f is not a function', fs);
      inv(isTask(task), 'Task.bimap(_, _, t): t is not a task', task);
      return task.map(fs).mapRejected(ff);
    }
  }, {
    key: 'chain',
    value: function chain(fn, task) {
      inv(isFun(fn), 'Task.chain(f, _): f is not a function', fn);
      inv(isTask(task), 'Task.chain(_, t): t is not a task', task);
      return new Chain(task, fn);
    }
  }, {
    key: 'orElse',
    value: function orElse(fn, task) {
      inv(isFun(fn), 'Task.orElse(f, _): f is not a function', fn);
      inv(isTask(task), 'Task.orElse(_, t): t is not a task', task);
      return new OrElse(task, fn);
    }
  }, {
    key: 'recur',
    value: function recur(fn, task) {
      inv(isFun(fn), 'Task.recur(f, _): f is not a function', fn);
      inv(isTask(task), 'Task.recur(_, t): t is not a task', task);
      return new Recur(task, fn);
    }
  }, {
    key: 'chainRec',
    value: function chainRec(fn, initial) {
      inv(isFun(fn), 'Task.chainRec(f, _): f is not a function', fn);
      return new ChainRec(fn, initial);
    }

    // Applies the successful value of task `this` to the successful value of task `otherTask`

  }, {
    key: 'ap',
    value: function ap(tf, tx) {
      inv(isTask(tf), 'Task.ap(t, _): t is not a task', tf);
      inv(isTask(tx), 'Task.ap(_, t): t is not a task', tx);
      return tf.chain(function (f) {
        return tx.map(function (x) {
          return f(x);
        });
      });
    }
  }, {
    key: 'concat',
    value: function concat(a, b) {
      inv(isTask(a), 'Task.concat(t, _): t is not a task', a);
      inv(isTask(b), 'Task.concat(_, t): t is not a task', b);
      return Task.race([a, b]);
    }
  }, {
    key: 'do',
    value: function _do(generator) {
      inv(isFun(generator), 'Task.do(f): f is not a function', generator);
      return new Do(generator);
    }
  }, {
    key: 'fromPromise',
    value: function fromPromise(promise) {
      inv(isThenableOrFn(promise), 'Task.fromPromise(p): p is not a promise', promise);
      return new FromPromise(promise);
    }
  }]);
  return Task;
}();

function makeFLCompatible(constructor) {
  constructor.prototype[index.of] = constructor[index.of] = constructor.of;
  constructor.prototype[index.empty] = constructor[index.empty] = constructor.empty;
  constructor.prototype[index.chainRec] = constructor[index.chainRec] = constructor.chainRec;
  constructor.prototype[index.concat] = constructor.prototype.concat;
  constructor.prototype[index.map] = constructor.prototype.map;
  constructor.prototype[index.bimap] = constructor.prototype.bimap;
  constructor.prototype[index.ap] = constructor.prototype.ap;
  constructor.prototype[index.chain] = constructor.prototype.chain;
}

makeFLCompatible(Task);

var FromComputation = function (_Task) {
  inherits(FromComputation, _Task);

  function FromComputation(computation) {
    classCallCheck(this, FromComputation);

    var _this3 = possibleConstructorReturn(this, (FromComputation.__proto__ || Object.getPrototypeOf(FromComputation)).call(this));

    _this3._computation = computation;
    return _this3;
  }

  createClass(FromComputation, [{
    key: '_run',
    value: function _run(handlers) {
      var _computation = this._computation;

      return runHelper(function (s, f, c) {
        var cancel = void 0;
        if (c) {
          try {
            cancel = _computation(s, f);
          } catch (e) {
            c(e);
          }
        } else {
          cancel = _computation(s, f);
        }
        return { onCancel: cancel || noop };
      }, handlers);
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return 'create(..)';
    }
  }]);
  return FromComputation;
}(Task);

var Of = function (_Task2) {
  inherits(Of, _Task2);

  function Of(value) {
    classCallCheck(this, Of);

    var _this4 = possibleConstructorReturn(this, (Of.__proto__ || Object.getPrototypeOf(Of)).call(this));

    _this4._value = value;
    return _this4;
  }

  createClass(Of, [{
    key: '_run',
    value: function _run(handlers) {
      var success = handlers.success;

      success(this._value);
      return noop;
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return 'of(..)';
    }
  }]);
  return Of;
}(Task);

var Rejected = function (_Task3) {
  inherits(Rejected, _Task3);

  function Rejected(error) {
    classCallCheck(this, Rejected);

    var _this5 = possibleConstructorReturn(this, (Rejected.__proto__ || Object.getPrototypeOf(Rejected)).call(this));

    _this5._error = error;
    return _this5;
  }

  createClass(Rejected, [{
    key: '_run',
    value: function _run(handlers) {
      var failure = handlers.failure;

      failure(this._error);
      return noop;
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return 'rejected(..)';
    }
  }]);
  return Rejected;
}(Task);

var Empty = function (_Task4) {
  inherits(Empty, _Task4);

  function Empty() {
    classCallCheck(this, Empty);
    return possibleConstructorReturn(this, (Empty.__proto__ || Object.getPrototypeOf(Empty)).apply(this, arguments));
  }

  createClass(Empty, [{
    key: 'run',
    value: function run() {
      return noop;
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return 'empty()';
    }
  }]);
  return Empty;
}(Task);

var Parallel = function (_Task5) {
  inherits(Parallel, _Task5);

  function Parallel(tasks) {
    classCallCheck(this, Parallel);

    var _this7 = possibleConstructorReturn(this, (Parallel.__proto__ || Object.getPrototypeOf(Parallel)).call(this));

    _this7._tasks = tasks;
    return _this7;
  }

  createClass(Parallel, [{
    key: '_run',
    value: function _run(handlers) {
      var _this8 = this;

      return runHelper(function (s, f, c) {
        var length = _this8._tasks.length;
        var values = Array(length);
        var completedCount = 0;
        var runTask = function runTask(task, index$$1) {
          return task.run({
            success: function success(x) {
              values[index$$1] = x;
              completedCount++;
              if (completedCount === length) {
                s(values);
              }
            },

            failure: f,
            catch: c
          });
        };
        var cancels = _this8._tasks.map(runTask);
        return {
          onClose: function onClose() {
            cancels.forEach(function (cancel) {
              return cancel();
            });
          }
        };
      }, handlers);
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return 'parallel([' + this._tasks.map(function (x) {
        return x._toString();
      }).join(', ') + '])';
    }
  }]);
  return Parallel;
}(Task);

var Race = function (_Task6) {
  inherits(Race, _Task6);

  function Race(tasks) {
    classCallCheck(this, Race);

    var _this9 = possibleConstructorReturn(this, (Race.__proto__ || Object.getPrototypeOf(Race)).call(this));

    _this9._tasks = tasks;
    return _this9;
  }

  createClass(Race, [{
    key: '_run',
    value: function _run(handlers) {
      var _this10 = this;

      return runHelper(function (success, failure, _catch) {
        var handlers = { success: success, failure: failure, catch: _catch };
        var cancels = _this10._tasks.map(function (task) {
          return task.run(handlers);
        });
        return {
          onClose: function onClose() {
            cancels.forEach(function (cancel) {
              return cancel();
            });
          }
        };
      }, handlers);
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return 'race([' + this._tasks.map(function (x) {
        return x._toString();
      }).join(', ') + '])';
    }
  }]);
  return Race;
}(Task);

var Map = function (_Task7) {
  inherits(Map, _Task7);

  function Map(task, fn) {
    classCallCheck(this, Map);

    var _this11 = possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this));

    _this11._task = task;
    _this11._fn = fn;
    return _this11;
  }

  createClass(Map, [{
    key: '_run',
    value: function _run(handlers) {
      var _fn = this._fn;
      var success = handlers.success;
      var failure = handlers.failure;
      var catch_ = handlers.catch;

      return this._task.run({
        success: function (_success) {
          function success(_x3) {
            return _success.apply(this, arguments);
          }

          success.toString = function () {
            return _success.toString();
          };

          return success;
        }(function (x) {
          var value = void 0;
          if (catch_) {
            try {
              value = _fn(x);
            } catch (e) {
              catch_(e);
              return;
            }
          } else {
            value = _fn(x);
          }
          success(value);
        }),

        failure: failure,
        catch: catch_
      });
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return this._task._toString() + '.map(..)';
    }
  }]);
  return Map;
}(Task);

var MapRejected = function (_Task8) {
  inherits(MapRejected, _Task8);

  function MapRejected(task, fn) {
    classCallCheck(this, MapRejected);

    var _this12 = possibleConstructorReturn(this, (MapRejected.__proto__ || Object.getPrototypeOf(MapRejected)).call(this));

    _this12._task = task;
    _this12._fn = fn;
    return _this12;
  }

  createClass(MapRejected, [{
    key: '_run',
    value: function _run(handlers) {
      var _fn = this._fn;
      var success = handlers.success;
      var failure = handlers.failure;
      var catch_ = handlers.catch;

      return this._task.run({
        success: success,
        failure: function (_failure) {
          function failure(_x4) {
            return _failure.apply(this, arguments);
          }

          failure.toString = function () {
            return _failure.toString();
          };

          return failure;
        }(function (x) {
          var value = void 0;
          if (catch_) {
            try {
              value = _fn(x);
            } catch (e) {
              catch_(e);
              return;
            }
          } else {
            value = _fn(x);
          }
          failure(value);
        }),

        catch: catch_
      });
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return this._task._toString() + '.mapRejected(..)';
    }
  }]);
  return MapRejected;
}(Task);

var Chain = function (_Task9) {
  inherits(Chain, _Task9);

  function Chain(task, fn) {
    classCallCheck(this, Chain);

    var _this13 = possibleConstructorReturn(this, (Chain.__proto__ || Object.getPrototypeOf(Chain)).call(this));

    _this13._task = task;
    _this13._fn = fn;
    return _this13;
  }

  createClass(Chain, [{
    key: '_run',
    value: function _run(handlers) {
      var _fn = this._fn;
      var _task = this._task;

      return runHelper(function (success, failure, catch_) {
        var cancel = noop;
        var spawnedHasBeenRun = false;
        var cancel1 = _task.run({
          // #1
          success: function (_success2) {
            function success(_x5) {
              return _success2.apply(this, arguments);
            }

            success.toString = function () {
              return _success2.toString();
            };

            return success;
          }(function (x) {
            var spawned = void 0;
            if (catch_) {
              try {
                spawned = _fn(x);
              } catch (e) {
                catch_(e);
              }
            } else {
              spawned = _fn(x);
            }
            if (spawned) {
              cancel = spawned.run({ success: success, failure: failure, catch: catch_ }); // #2
              spawnedHasBeenRun = true;
            }
          }),

          failure: failure,
          catch: catch_
        });
        if (!spawnedHasBeenRun) {
          // #2 run() may return before #1 run() returns
          cancel = cancel1;
        }
        return {
          onCancel: function onCancel() {
            cancel();
          }
        };
      }, handlers);
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return this._task._toString() + '.chain(..)';
    }
  }]);
  return Chain;
}(Task);

var OrElse = function (_Task10) {
  inherits(OrElse, _Task10);

  function OrElse(task, fn) {
    classCallCheck(this, OrElse);

    var _this14 = possibleConstructorReturn(this, (OrElse.__proto__ || Object.getPrototypeOf(OrElse)).call(this));

    _this14._task = task;
    _this14._fn = fn;
    return _this14;
  }

  createClass(OrElse, [{
    key: '_run',
    value: function _run(handlers) {
      var _fn = this._fn;
      var _task = this._task;

      return runHelper(function (success, failure, catch_) {
        var cancel = noop;
        var spawnedHasBeenRun = false;
        var cancel1 = _task.run({ // #1
          success: success,
          failure: function (_failure2) {
            function failure(_x6) {
              return _failure2.apply(this, arguments);
            }

            failure.toString = function () {
              return _failure2.toString();
            };

            return failure;
          }(function (x) {
            var spawned = void 0;
            if (catch_) {
              try {
                spawned = _fn(x);
              } catch (e) {
                catch_(e);
              }
            } else {
              spawned = _fn(x);
            }
            if (spawned) {
              cancel = spawned.run({ success: success, failure: failure, catch: catch_ }); // #2
              spawnedHasBeenRun = true;
            }
          }),

          catch: catch_
        });
        if (!spawnedHasBeenRun) {
          // #2 run() may return before #1 run() returns
          cancel = cancel1;
        }
        return {
          onCancel: function onCancel() {
            cancel();
          }
        };
      }, handlers);
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return this._task._toString() + '.orElse(..)';
    }
  }]);
  return OrElse;
}(Task);

var Recur = function (_Task11) {
  inherits(Recur, _Task11);

  function Recur(task, fn) {
    classCallCheck(this, Recur);

    var _this15 = possibleConstructorReturn(this, (Recur.__proto__ || Object.getPrototypeOf(Recur)).call(this));

    _this15._task = task;
    _this15._fn = fn;
    return _this15;
  }

  createClass(Recur, [{
    key: '_run',
    value: function _run(handlers) {
      var _fn = this._fn;
      var _task = this._task;

      return runHelper(function (_, failure, catch_) {
        var x = void 0;
        var haveNewX = false;
        var inLoop = false;
        var spawnedHasBeenRun = false;
        var sharedCancel = noop;
        var success = function success(_x) {
          haveNewX = true;
          x = _x;
          if (inLoop) {
            return;
          }
          inLoop = true;
          while (haveNewX) {
            haveNewX = false;
            var spawned = void 0;
            if (catch_) {
              try {
                spawned = _fn(x);
              } catch (e) {
                catch_(e);
              }
            } else {
              spawned = _fn(x);
            }
            if (spawned) {
              sharedCancel = spawned.run({ success: success, failure: failure, catch: catch_ }); // #2
              spawnedHasBeenRun = true;
            }
          }
          inLoop = false;
        };
        var cancel = _task.run({ success: success, failure: failure, catch: catch_ }); // #1
        if (!spawnedHasBeenRun) {
          // #2 run() may return before #1 run() returns
          sharedCancel = cancel;
        }
        return {
          onCancel: function onCancel() {
            sharedCancel();
          }
        };
      }, handlers);
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return this._task._toString() + '.recur(..)';
    }
  }]);
  return Recur;
}(Task);

var ChainRec = function (_Task12) {
  inherits(ChainRec, _Task12);

  function ChainRec(fn, initial) {
    classCallCheck(this, ChainRec);

    var _this16 = possibleConstructorReturn(this, (ChainRec.__proto__ || Object.getPrototypeOf(ChainRec)).call(this));

    _this16._fn = fn;
    _this16._initial = initial;
    return _this16;
  }

  createClass(ChainRec, [{
    key: '_run',
    value: function _run(handlers) {
      var _fn = this._fn;
      var _initial = this._initial;

      return runHelper(function (success, failure, catch_) {
        var newNext = null;
        var haveNewNext = false;
        var inLoop = false;
        var sharedCancel = noop;
        var step = function step(result) {
          if (result.type === 'done') {
            success(result.value);
            return;
          }
          newNext = result.value;
          haveNewNext = true;
          if (inLoop) {
            return;
          }
          inLoop = true;
          while (haveNewNext) {
            haveNewNext = false;
            var spawned = void 0;
            if (catch_) {
              try {
                spawned = _fn(chainRecNext, chainRecDone, newNext);
              } catch (e) {
                catch_(e);
              }
            } else {
              spawned = _fn(chainRecNext, chainRecDone, newNext);
            }
            if (spawned) {
              sharedCancel = spawned.run({ success: step, failure: failure, catch: catch_ });
            }
          }
          inLoop = false;
        };
        step(chainRecNext(_initial));
        return {
          onCancel: function onCancel() {
            sharedCancel();
          }
        };
      }, handlers);
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return 'chainRec(..)';
    }
  }]);
  return ChainRec;
}(Task);

var Do = function (_Task13) {
  inherits(Do, _Task13);

  function Do(generator) {
    classCallCheck(this, Do);

    var _this17 = possibleConstructorReturn(this, (Do.__proto__ || Object.getPrototypeOf(Do)).call(this));

    _this17._generator = generator;
    return _this17;
  }

  createClass(Do, [{
    key: '_run',
    value: function _run(handlers) {
      var _generator = this._generator;

      return runHelper(function (success, failure, catch_) {
        var iterator = _generator();
        var x = void 0;
        var haveNewX = false;
        var inLoop = false;
        var sharedCancel = noop;
        var step = function step(_x) {
          haveNewX = true;
          x = _x;
          if (inLoop) {
            return;
          }
          inLoop = true;
          while (haveNewX) {
            haveNewX = false;
            var iteratorNext = void 0;
            if (catch_) {
              try {
                iteratorNext = iterator.next(x);
              } catch (e) {
                catch_(e);
              }
            } else {
              iteratorNext = iterator.next(x);
            }
            if (iteratorNext) {
              var _iteratorNext = iteratorNext;
              var spawned = _iteratorNext.value;
              var _done = _iteratorNext.done;

              sharedCancel = spawned.run({ success: _done ? success : step, failure: failure, catch: catch_ });
            }
          }
          inLoop = false;
        };
        step(undefined);
        return {
          onCancel: function onCancel() {
            sharedCancel();
          }
        };
      }, handlers);
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return 'do(..)';
    }
  }]);
  return Do;
}(Task);

var FromPromise = function (_Task14) {
  inherits(FromPromise, _Task14);

  function FromPromise(promise) {
    classCallCheck(this, FromPromise);

    var _this18 = possibleConstructorReturn(this, (FromPromise.__proto__ || Object.getPrototypeOf(FromPromise)).call(this));

    _this18._promise = promise;
    return _this18;
  }

  createClass(FromPromise, [{
    key: '_run',
    value: function _run(handlers) {
      var _promise = this._promise;

      var promise = typeof _promise === 'function' ? _promise() : _promise;
      return runHelper(function (success, _, catch_) {
        promise.then(success, catch_);
        return {};
      }, handlers);
    }
  }, {
    key: '_toString',
    value: function _toString() {
      return 'fromPromise(..)';
    }
  }]);
  return FromPromise;
}(Task);

return Task;

})));
