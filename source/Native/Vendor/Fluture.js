/**
 * Fluture bundled; version 7.1.1 (dirty)
 */

var Fluture = (function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index$3 = createCommonjsModule(function (module) {
/*
        @@@@@@@            @@@@@@@         @@
      @@       @@        @@       @@      @@@
    @@   @@@ @@  @@    @@   @@@ @@  @@   @@@@@@ @@   @@@  @@ @@@      @@@@
   @@  @@   @@@   @@  @@  @@   @@@   @@   @@@   @@   @@@  @@@   @@  @@@   @@
   @@  @@   @@@   @@  @@  @@   @@@   @@   @@@   @@   @@@  @@@   @@  @@@@@@@@
   @@  @@   @@@  @@   @@  @@   @@@  @@    @@@   @@   @@@  @@@   @@  @@@
    @@   @@@ @@@@@     @@   @@@ @@@@@      @@@    @@@ @@  @@@@@@      @@@@@
      @@                 @@                           @@  @@
        @@@@@@@            @@@@@@@               @@@@@    @@
                                                          */
//. # sanctuary-type-identifiers
//.
//. A type is a set of values. Boolean, for example, is the type comprising
//. `true` and `false`. A value may be a member of multiple types (`42` is a
//. member of Number, PositiveNumber, Integer, and many other types).
//.
//. In certain situations it is useful to divide JavaScript values into
//. non-overlapping types. The language provides two constructs for this
//. purpose: the [`typeof`][1] operator and [`Object.prototype.toString`][2].
//. Each has pros and cons, but neither supports user-defined types.
//.
//. This package specifies an [algorithm][3] for deriving a _type identifier_
//. from any JavaScript value, and exports an implementation of the algorithm.
//. Authors of algebraic data types may follow this specification in order to
//. make their data types compatible with the algorithm.
//.
//. ### Algorithm
//.
//. 1.  Take any JavaScript value `x`.
//.
//. 2.  If `x` is `null` or `undefined`, go to step 6.
//.
//. 3.  If `x.constructor` evaluates to `null` or `undefined`, go to step 6.
//.
//. 4.  If `x.constructor.prototype === x`, go to step 6. This check prevents a
//.     prototype object from being considered a member of its associated type.
//.
//. 5.  If `typeof x.constructor['@@type']` evaluates to `'string'`, return
//.     the value of `x.constructor['@@type']`.
//.
//. 6.  Return the [`Object.prototype.toString`][2] representation of `x`
//.     without the leading `'[object '` and trailing `']'`.
//.
//. ### Compatibility
//.
//. For an algebraic data type to be compatible with the [algorithm][3]:
//.
//.   - every member of the type must have a `constructor` property pointing
//.     to an object known as the _type representative_;
//.
//.   - the type representative must have a `@@type` property; and
//.
//.   - the type representative's `@@type` property (the _type identifier_)
//.     must be a string primitive, ideally `'<npm-package-name>/<type-name>'`.
//.
//. For example:
//.
//. ```javascript
//. //  Identity :: a -> Identity a
//. function Identity(x) {
//.   if (!(this instanceof Identity)) return new Identity(x);
//.   this.value = x;
//. }
//.
//. Identity['@@type'] = 'my-package/Identity';
//. ```
//.
//. Note that by using a constructor function the `constructor` property is set
//. implicitly for each value created. Constructor functions are convenient for
//. this reason, but are not required. This definition is also valid:
//.
//. ```javascript
//. //  IdentityTypeRep :: TypeRep Identity
//. var IdentityTypeRep = {
//.   '@@type': 'my-package/Identity'
//. };
//.
//. //  Identity :: a -> Identity a
//. function Identity(x) {
//.   return {constructor: IdentityTypeRep, value: x};
//. }
//. ```
//.
//. ### Usage
//.
//. ```javascript
//. var Identity = require('my-package').Identity;
//. var type = require('sanctuary-type-identifiers');
//.
//. type(null);         // => 'Null'
//. type(true);         // => 'Boolean'
//. type([1, 2, 3]);    // => 'Array'
//. type(Identity);     // => 'Function'
//. type(Identity(0));  // => 'my-package/Identity'
//. ```
//.
//.
//. [1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
//. [2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
//. [3]: #algorithm

(function(f) {

  'use strict';

  {
    module.exports = f();
  }

}(function() {

  'use strict';

  //  $$type :: String
  var $$type = '@@type';

  //  type :: Any -> String
  function type(x) {
    return x != null &&
           x.constructor != null &&
           x.constructor.prototype !== x &&
           typeof x.constructor[$$type] === 'string' ?
      x.constructor[$$type] :
      Object.prototype.toString.call(x).slice('[object '.length, -']'.length);
  }

  return type;

}));
});

var index$2 = createCommonjsModule(function (module) {
/*
             ############                  #
            ############                  ###
                  #####                  #####
                #####      ####################
              #####       ######################
            #####                     ###########
          #####         ######################
        #####          ####################
      #####                        #####
     ############                 ###
    ############                 */

//. # sanctuary-type-classes
//.
//. The [Fantasy Land Specification][FL] "specifies interoperability of common
//. algebraic structures" by defining a number of type classes. For each type
//. class, it states laws which every member of a type must obey in order for
//. the type to be a member of the type class. In order for the Maybe type to
//. be considered a [Functor][], for example, every `Maybe a` value must have
//. a `fantasy-land/map` method which obeys the identity and composition laws.
//.
//. This project provides:
//.
//.   - [`TypeClass`](#TypeClass), a function for defining type classes;
//.   - one `TypeClass` value for each Fantasy Land type class;
//.   - lawful Fantasy Land methods for JavaScript's built-in types;
//.   - one function for each Fantasy Land method; and
//.   - several functions derived from these functions.
//.
//. ## Type-class hierarchy
//.
//. <pre>
//:  Setoid   Semigroupoid  Semigroup   Foldable        Functor      Contravariant
//: (equals)    (compose)    (concat)   (reduce)         (map)        (contramap)
//:     |           |           |           \         / | | | | \
//:     |           |           |            \       /  | | | |  \
//:     |           |           |             \     /   | | | |   \
//:     |           |           |              \   /    | | | |    \
//:     |           |           |               \ /     | | | |     \
//:    Ord      Category     Monoid         Traversable | | | |      \
//:   (lte)       (id)       (empty)        (traverse)  / | | \       \
//:                                                    /  | |  \       \
//:                                                   /   / \   \       \
//:                                           Profunctor /   \ Bifunctor \
//:                                            (promap) /     \ (bimap)   \
//:                                                    /       \           \
//:                                                   /         \           \
//:                                                 Alt        Apply      Extend
//:                                                (alt)        (ap)     (extend)
//:                                                 /           / \           \
//:                                                /           /   \           \
//:                                               /           /     \           \
//:                                              /           /       \           \
//:                                             /           /         \           \
//:                                           Plus    Applicative    Chain      Comonad
//:                                          (zero)       (of)      (chain)    (extract)
//:                                             \         / \         / \
//:                                              \       /   \       /   \
//:                                               \     /     \     /     \
//:                                                \   /       \   /       \
//:                                                 \ /         \ /         \
//:                                             Alternative    Monad     ChainRec
//:                                                                     (chainRec)
//. </pre>
//.
//. ## API

(function(f) {

  'use strict';

  /* istanbul ignore else */
  {
    module.exports = f(index$3);
  }

}(function(type) {

  'use strict';

  //  concat_ :: Array a -> Array a -> Array a
  function concat_(xs) {
    return function(ys) {
      return xs.concat(ys);
    };
  }

  //  constant :: a -> b -> a
  function constant(x) {
    return function(y) {
      return x;
    };
  }

  //  has :: (String, Object) -> Boolean
  function has(k, o) {
    return Object.prototype.hasOwnProperty.call(o, k);
  }

  //  identity :: a -> a
  function identity(x) { return x; }

  //  pair :: a -> b -> Pair a b
  function pair(x) {
    return function(y) {
      return [x, y];
    };
  }

  //  sameType :: (a, b) -> Boolean
  function sameType(x, y) {
    return typeof x === typeof y && type(x) === type(y);
  }

  //  type Iteration a = { value :: a, done :: Boolean }

  //  iterationNext :: a -> Iteration a
  function iterationNext(x) { return {value: x, done: false}; }

  //  iterationDone :: a -> Iteration a
  function iterationDone(x) { return {value: x, done: true}; }

  //# TypeClass :: (String, String, Array TypeClass, a -> Boolean) -> TypeClass
  //.
  //. The arguments are:
  //.
  //.   - the name of the type class, prefixed by its npm package name;
  //.   - the documentation URL of the type class;
  //.   - an array of dependencies; and
  //.   - a predicate which accepts any JavaScript value and returns `true`
  //.     if the value satisfies the requirements of the type class; `false`
  //.     otherwise.
  //.
  //. Example:
  //.
  //. ```javascript
  //. //    hasMethod :: String -> a -> Boolean
  //. const hasMethod = name => x => x != null && typeof x[name] == 'function';
  //.
  //. //    Foo :: TypeClass
  //. const Foo = Z.TypeClass(
  //.   'my-package/Foo',
  //.   'http://example.com/my-package#Foo',
  //.   [],
  //.   hasMethod('foo')
  //. );
  //.
  //. //    Bar :: TypeClass
  //. const Bar = Z.TypeClass(
  //.   'my-package/Bar',
  //.   'http://example.com/my-package#Bar',
  //.   [Foo],
  //.   hasMethod('bar')
  //. );
  //. ```
  //.
  //. Types whose values have a `foo` method are members of the Foo type class.
  //. Members of the Foo type class whose values have a `bar` method are also
  //. members of the Bar type class.
  //.
  //. Each `TypeClass` value has a `test` field: a function which accepts
  //. any JavaScript value and returns `true` if the value satisfies the
  //. type class's predicate and the predicates of all the type class's
  //. dependencies; `false` otherwise.
  //.
  //. `TypeClass` values may be used with [sanctuary-def][type-classes]
  //. to define parametrically polymorphic functions which verify their
  //. type-class constraints at run time.
  function TypeClass(name, url, dependencies, test) {
    if (!(this instanceof TypeClass)) {
      return new TypeClass(name, url, dependencies, test);
    }
    this.name = name;
    this.url = url;
    this.test = function(x) {
      return dependencies.every(function(d) { return d.test(x); }) && test(x);
    };
  }

  TypeClass['@@type'] = 'sanctuary-type-classes/TypeClass';

  //  data Location = Constructor | Value

  //  Constructor :: Location
  var Constructor = 'Constructor';

  //  Value :: Location
  var Value = 'Value';

  //  _funcPath :: (Boolean, Array String, a) -> Nullable Function
  function _funcPath(allowInheritedProps, path, _x) {
    var x = _x;
    for (var idx = 0; idx < path.length; idx += 1) {
      var k = path[idx];
      if (x == null || !(allowInheritedProps || has(k, x))) { return null; }
      x = x[k];
    }
    return typeof x === 'function' ? x : null;
  }

  //  funcPath :: (Array String, a) -> Nullable Function
  function funcPath(path, x) {
    return _funcPath(true, path, x);
  }

  //  implPath :: Array String -> Nullable Function
  function implPath(path) {
    return _funcPath(false, path, implementations);
  }

  //  functionName :: Function -> String
  var functionName = 'name' in function f() {} ?
    function functionName(f) { return f.name; } :
    /* istanbul ignore next */
    function functionName(f) {
      var match = /function (\w*)/.exec(f);
      return match == null ? '' : match[1];
    };

  //  $ :: (String, Array TypeClass, StrMap (Array Location)) -> TypeClass
  function $(_name, dependencies, requirements) {
    function getBoundMethod(_name) {
      var name = 'fantasy-land/' + _name;
      return requirements[_name] === Constructor ?
        function(typeRep) {
          var f = funcPath([name], typeRep);
          return f == null && typeof typeRep === 'function' ?
            implPath([functionName(typeRep), name]) :
            f;
        } :
        function(x) {
          var isPrototype = x != null &&
                            x.constructor != null &&
                            x.constructor.prototype === x;
          var m = null;
          if (!isPrototype) { m = funcPath([name], x); }
          if (m == null)    { m = implPath([type(x), 'prototype', name]); }
          return m && m.bind(x);
        };
    }

    var version = '6.0.0';  // updated programmatically
    var keys = Object.keys(requirements);

    var typeClass = TypeClass(
      'sanctuary-type-classes/' + _name,
      'https://github.com/sanctuary-js/sanctuary-type-classes/tree/v' + version
        + '#' + _name,
      dependencies,
      function(x) {
        return keys.every(function(_name) {
          var arg = requirements[_name] === Constructor ? x.constructor : x;
          return getBoundMethod(_name)(arg) != null;
        });
      }
    );

    typeClass.methods = keys.reduce(function(methods, _name) {
      methods[_name] = getBoundMethod(_name);
      return methods;
    }, {});

    return typeClass;
  }

  //# Setoid :: TypeClass
  //.
  //. `TypeClass` value for [Setoid][].
  //.
  //. ```javascript
  //. > Setoid.test(null)
  //. true
  //. ```
  var Setoid = $('Setoid', [], {equals: Value});

  //# Ord :: TypeClass
  //.
  //. `TypeClass` value for [Ord][].
  //.
  //. ```javascript
  //. > Ord.test(0)
  //. true
  //.
  //. > Ord.test(Math.sqrt)
  //. false
  //. ```
  var Ord = $('Ord', [Setoid], {lte: Value});

  //# Semigroupoid :: TypeClass
  //.
  //. `TypeClass` value for [Semigroupoid][].
  //.
  //. ```javascript
  //. > Semigroupoid.test(Math.sqrt)
  //. true
  //.
  //. > Semigroupoid.test(0)
  //. false
  //. ```
  var Semigroupoid = $('Semigroupoid', [], {compose: Value});

  //# Category :: TypeClass
  //.
  //. `TypeClass` value for [Category][].
  //.
  //. ```javascript
  //. > Category.test(Math.sqrt)
  //. true
  //.
  //. > Category.test(0)
  //. false
  //. ```
  var Category = $('Category', [Semigroupoid], {id: Constructor});

  //# Semigroup :: TypeClass
  //.
  //. `TypeClass` value for [Semigroup][].
  //.
  //. ```javascript
  //. > Semigroup.test('')
  //. true
  //.
  //. > Semigroup.test(0)
  //. false
  //. ```
  var Semigroup = $('Semigroup', [], {concat: Value});

  //# Monoid :: TypeClass
  //.
  //. `TypeClass` value for [Monoid][].
  //.
  //. ```javascript
  //. > Monoid.test('')
  //. true
  //.
  //. > Monoid.test(0)
  //. false
  //. ```
  var Monoid = $('Monoid', [Semigroup], {empty: Constructor});

  //# Functor :: TypeClass
  //.
  //. `TypeClass` value for [Functor][].
  //.
  //. ```javascript
  //. > Functor.test([])
  //. true
  //.
  //. > Functor.test('')
  //. false
  //. ```
  var Functor = $('Functor', [], {map: Value});

  //# Bifunctor :: TypeClass
  //.
  //. `TypeClass` value for [Bifunctor][].
  //.
  //. ```javascript
  //. > Bifunctor.test(Tuple('foo', 64))
  //. true
  //.
  //. > Bifunctor.test([])
  //. false
  //. ```
  var Bifunctor = $('Bifunctor', [Functor], {bimap: Value});

  //# Profunctor :: TypeClass
  //.
  //. `TypeClass` value for [Profunctor][].
  //.
  //. ```javascript
  //. > Profunctor.test(Math.sqrt)
  //. true
  //.
  //. > Profunctor.test([])
  //. false
  //. ```
  var Profunctor = $('Profunctor', [Functor], {promap: Value});

  //# Apply :: TypeClass
  //.
  //. `TypeClass` value for [Apply][].
  //.
  //. ```javascript
  //. > Apply.test([])
  //. true
  //.
  //. > Apply.test('')
  //. false
  //. ```
  var Apply = $('Apply', [Functor], {ap: Value});

  //# Applicative :: TypeClass
  //.
  //. `TypeClass` value for [Applicative][].
  //.
  //. ```javascript
  //. > Applicative.test([])
  //. true
  //.
  //. > Applicative.test({})
  //. false
  //. ```
  var Applicative = $('Applicative', [Apply], {of: Constructor});

  //# Chain :: TypeClass
  //.
  //. `TypeClass` value for [Chain][].
  //.
  //. ```javascript
  //. > Chain.test([])
  //. true
  //.
  //. > Chain.test({})
  //. false
  //. ```
  var Chain = $('Chain', [Apply], {chain: Value});

  //# ChainRec :: TypeClass
  //.
  //. `TypeClass` value for [ChainRec][].
  //.
  //. ```javascript
  //. > ChainRec.test([])
  //. true
  //.
  //. > ChainRec.test({})
  //. false
  //. ```
  var ChainRec = $('ChainRec', [Chain], {chainRec: Constructor});

  //# Monad :: TypeClass
  //.
  //. `TypeClass` value for [Monad][].
  //.
  //. ```javascript
  //. > Monad.test([])
  //. true
  //.
  //. > Monad.test({})
  //. false
  //. ```
  var Monad = $('Monad', [Applicative, Chain], {});

  //# Alt :: TypeClass
  //.
  //. `TypeClass` value for [Alt][].
  //.
  //. ```javascript
  //. > Alt.test({})
  //. true
  //.
  //. > Alt.test('')
  //. false
  //. ```
  var Alt = $('Alt', [Functor], {alt: Value});

  //# Plus :: TypeClass
  //.
  //. `TypeClass` value for [Plus][].
  //.
  //. ```javascript
  //. > Plus.test({})
  //. true
  //.
  //. > Plus.test('')
  //. false
  //. ```
  var Plus = $('Plus', [Alt], {zero: Constructor});

  //# Alternative :: TypeClass
  //.
  //. `TypeClass` value for [Alternative][].
  //.
  //. ```javascript
  //. > Alternative.test([])
  //. true
  //.
  //. > Alternative.test({})
  //. false
  //. ```
  var Alternative = $('Alternative', [Applicative, Plus], {});

  //# Foldable :: TypeClass
  //.
  //. `TypeClass` value for [Foldable][].
  //.
  //. ```javascript
  //. > Foldable.test({})
  //. true
  //.
  //. > Foldable.test('')
  //. false
  //. ```
  var Foldable = $('Foldable', [], {reduce: Value});

  //# Traversable :: TypeClass
  //.
  //. `TypeClass` value for [Traversable][].
  //.
  //. ```javascript
  //. > Traversable.test([])
  //. true
  //.
  //. > Traversable.test('')
  //. false
  //. ```
  var Traversable = $('Traversable', [Functor, Foldable], {traverse: Value});

  //# Extend :: TypeClass
  //.
  //. `TypeClass` value for [Extend][].
  //.
  //. ```javascript
  //. > Extend.test([])
  //. true
  //.
  //. > Extend.test({})
  //. false
  //. ```
  var Extend = $('Extend', [Functor], {extend: Value});

  //# Comonad :: TypeClass
  //.
  //. `TypeClass` value for [Comonad][].
  //.
  //. ```javascript
  //. > Comonad.test(Identity(0))
  //. true
  //.
  //. > Comonad.test([])
  //. false
  //. ```
  var Comonad = $('Comonad', [Extend], {extract: Value});

  //# Contravariant :: TypeClass
  //.
  //. `TypeClass` value for [Contravariant][].
  //.
  //. ```javascript
  //. > Contravariant.test(Math.sqrt)
  //. true
  //.
  //. > Contravariant.test([])
  //. false
  //. ```
  var Contravariant = $('Contravariant', [], {contramap: Value});

  //  Null$prototype$toString :: Null ~> () -> String
  function Null$prototype$toString() {
    return 'null';
  }

  //  Null$prototype$equals :: Null ~> Null -> Boolean
  function Null$prototype$equals(other) {
    return true;
  }

  //  Null$prototype$lte :: Null ~> Null -> Boolean
  function Null$prototype$lte(other) {
    return true;
  }

  //  Undefined$prototype$toString :: Undefined ~> () -> String
  function Undefined$prototype$toString() {
    return 'undefined';
  }

  //  Undefined$prototype$equals :: Undefined ~> Undefined -> Boolean
  function Undefined$prototype$equals(other) {
    return true;
  }

  //  Undefined$prototype$lte :: Undefined ~> Undefined -> Boolean
  function Undefined$prototype$lte(other) {
    return true;
  }

  //  Boolean$prototype$toString :: Boolean ~> () -> String
  function Boolean$prototype$toString() {
    return typeof this === 'object' ?
      'new Boolean(' + toString(this.valueOf()) + ')' :
      this.toString();
  }

  //  Boolean$prototype$equals :: Boolean ~> Boolean -> Boolean
  function Boolean$prototype$equals(other) {
    return typeof this === 'object' ?
      equals(this.valueOf(), other.valueOf()) :
      this === other;
  }

  //  Boolean$prototype$lte :: Boolean ~> Boolean -> Boolean
  function Boolean$prototype$lte(other) {
    return typeof this === 'object' ?
      lte(this.valueOf(), other.valueOf()) :
      this === false || other === true;
  }

  //  Number$prototype$toString :: Number ~> () -> String
  function Number$prototype$toString() {
    return typeof this === 'object' ?
      'new Number(' + toString(this.valueOf()) + ')' :
      1 / this === -Infinity ? '-0' : this.toString(10);
  }

  //  Number$prototype$equals :: Number ~> Number -> Boolean
  function Number$prototype$equals(other) {
    return typeof this === 'object' ?
      equals(this.valueOf(), other.valueOf()) :
      isNaN(this) && isNaN(other) || this === other;
  }

  //  Number$prototype$lte :: Number ~> Number -> Boolean
  function Number$prototype$lte(other) {
    return typeof this === 'object' ?
      lte(this.valueOf(), other.valueOf()) :
      isNaN(this) && isNaN(other) || this <= other;
  }

  //  Date$prototype$toString :: Date ~> () -> String
  function Date$prototype$toString() {
    var x = isNaN(this.valueOf()) ? NaN : this.toISOString();
    return 'new Date(' + toString(x) + ')';
  }

  //  Date$prototype$equals :: Date ~> Date -> Boolean
  function Date$prototype$equals(other) {
    return equals(this.valueOf(), other.valueOf());
  }

  //  Date$prototype$lte :: Date ~> Date -> Boolean
  function Date$prototype$lte(other) {
    return lte(this.valueOf(), other.valueOf());
  }

  //  RegExp$prototype$equals :: RegExp ~> RegExp -> Boolean
  function RegExp$prototype$equals(other) {
    return other.source === this.source &&
           other.global === this.global &&
           other.ignoreCase === this.ignoreCase &&
           other.multiline === this.multiline &&
           other.sticky === this.sticky &&
           other.unicode === this.unicode;
  }

  //  String$empty :: () -> String
  function String$empty() {
    return '';
  }

  //  String$prototype$toString :: String ~> () -> String
  function String$prototype$toString() {
    return typeof this === 'object' ?
      'new String(' + toString(this.valueOf()) + ')' :
      JSON.stringify(this);
  }

  //  String$prototype$equals :: String ~> String -> Boolean
  function String$prototype$equals(other) {
    return typeof this === 'object' ?
      equals(this.valueOf(), other.valueOf()) :
      this === other;
  }

  //  String$prototype$lte :: String ~> String -> Boolean
  function String$prototype$lte(other) {
    return typeof this === 'object' ?
      lte(this.valueOf(), other.valueOf()) :
      this <= other;
  }

  //  String$prototype$concat :: String ~> String -> String
  function String$prototype$concat(other) {
    return this + other;
  }

  //  Array$empty :: () -> Array a
  function Array$empty() {
    return [];
  }

  //  Array$of :: a -> Array a
  function Array$of(x) {
    return [x];
  }

  //  Array$chainRec :: ((a -> c, b -> c, a) -> Array c, a) -> Array b
  function Array$chainRec(f, x) {
    var $todo = [x];
    var $done = [];
    while ($todo.length > 0) {
      var xs = f(iterationNext, iterationDone, $todo.shift());
      var $more = [];
      for (var idx = 0; idx < xs.length; idx += 1) {
        (xs[idx].done ? $done : $more).push(xs[idx].value);
      }
      Array.prototype.unshift.apply($todo, $more);
    }
    return $done;
  }

  //  Array$zero :: () -> Array a
  function Array$zero() {
    return [];
  }

  //  Array$prototype$toString :: Array a ~> () -> String
  function Array$prototype$toString() {
    var this$1 = this;

    var reprs = this.map(toString);
    var keys = Object.keys(this).sort();
    for (var idx = 0; idx < keys.length; idx += 1) {
      var k = keys[idx];
      if (!/^\d+$/.test(k)) {
        reprs.push(toString(k) + ': ' + toString(this$1[k]));
      }
    }
    return '[' + reprs.join(', ') + ']';
  }

  //  Array$prototype$equals :: Array a ~> Array a -> Boolean
  function Array$prototype$equals(other) {
    var this$1 = this;

    if (other.length !== this.length) { return false; }
    for (var idx = 0; idx < this.length; idx += 1) {
      if (!equals(this$1[idx], other[idx])) { return false; }
    }
    return true;
  }

  //  Array$prototype$lte :: Array a ~> Array a -> Boolean
  function Array$prototype$lte(other) {
    var this$1 = this;

    for (var idx = 0; true; idx += 1) {
      if (idx === this$1.length) { return true; }
      if (idx === other.length) { return false; }
      if (!equals(this$1[idx], other[idx])) { return lte(this$1[idx], other[idx]); }
    }
  }

  //  Array$prototype$concat :: Array a ~> Array a -> Array a
  function Array$prototype$concat(other) {
    return this.concat(other);
  }

  //  Array$prototype$map :: Array a ~> (a -> b) -> Array b
  function Array$prototype$map(f) {
    return this.map(function(x) { return f(x); });
  }

  //  Array$prototype$ap :: Array a ~> Array (a -> b) -> Array b
  function Array$prototype$ap(fs) {
    var this$1 = this;

    var result = [];
    for (var idx = 0; idx < fs.length; idx += 1) {
      for (var idx2 = 0; idx2 < this.length; idx2 += 1) {
        result.push(fs[idx](this$1[idx2]));
      }
    }
    return result;
  }

  //  Array$prototype$chain :: Array a ~> (a -> Array b) -> Array b
  function Array$prototype$chain(f) {
    var result = [];
    this.forEach(function(x) { Array.prototype.push.apply(result, f(x)); });
    return result;
  }

  //  Array$prototype$alt :: Array a ~> Array a -> Array a
  var Array$prototype$alt = Array$prototype$concat;

  //  Array$prototype$reduce :: Array a ~> ((b, a) -> b, b) -> b
  function Array$prototype$reduce(f, initial) {
    return this.reduce(function(acc, x) { return f(acc, x); }, initial);
  }

  //  Array$prototype$traverse :: Applicative f => Array a ~> (TypeRep f, a -> f b) -> f (Array b)
  function Array$prototype$traverse(typeRep, f) {
    var xs = this;
    function go(idx, n) {
      switch (n) {
        case 0: return of(typeRep, []);
        case 2: return lift2(pair, f(xs[idx]), f(xs[idx + 1]));
        default:
          var m = Math.floor(n / 4) * 2;
          return lift2(concat_, go(idx, m), go(idx + m, n - m));
      }
    }
    return this.length % 2 === 1 ?
      lift2(concat_, map(Array$of, f(this[0])), go(1, this.length - 1)) :
      go(0, this.length);
  }

  //  Array$prototype$extend :: Array a ~> (Array a -> b) -> Array b
  function Array$prototype$extend(f) {
    return this.map(function(_, idx, xs) { return f(xs.slice(idx)); });
  }

  //  Arguments$prototype$toString :: Arguments ~> String
  function Arguments$prototype$toString() {
    var args = Array.prototype.map.call(this, toString).join(', ');
    return '(function () { return arguments; }(' + args + '))';
  }

  //  Arguments$prototype$equals :: Arguments ~> Arguments -> Boolean
  function Arguments$prototype$equals(other) {
    return Array$prototype$equals.call(this, other);
  }

  //  Arguments$prototype$lte :: Arguments ~> Arguments -> Boolean
  function Arguments$prototype$lte(other) {
    return Array$prototype$lte.call(this, other);
  }

  //  Error$prototype$toString :: Error ~> () -> String
  function Error$prototype$toString() {
    return 'new ' + this.name + '(' + toString(this.message) + ')';
  }

  //  Error$prototype$equals :: Error ~> Error -> Boolean
  function Error$prototype$equals(other) {
    return equals(this.name, other.name) &&
           equals(this.message, other.message);
  }

  //  Object$empty :: () -> StrMap a
  function Object$empty() {
    return {};
  }

  //  Object$zero :: () -> StrMap a
  function Object$zero() {
    return {};
  }

  //  Object$prototype$toString :: StrMap a ~> () -> String
  function Object$prototype$toString() {
    var this$1 = this;

    var reprs = [];
    var keys = Object.keys(this).sort();
    for (var idx = 0; idx < keys.length; idx += 1) {
      var k = keys[idx];
      reprs.push(toString(k) + ': ' + toString(this$1[k]));
    }
    return '{' + reprs.join(', ') + '}';
  }

  //  Object$prototype$equals :: StrMap a ~> StrMap a -> Boolean
  function Object$prototype$equals(other) {
    var self = this;
    var keys = Object.keys(this).sort();
    return equals(keys, Object.keys(other).sort()) &&
           keys.every(function(k) { return equals(self[k], other[k]); });
  }

  //  Object$prototype$lte :: StrMap a ~> StrMap a -> Boolean
  function Object$prototype$lte(other) {
    var this$1 = this;

    var theseKeys = Object.keys(this).sort();
    var otherKeys = Object.keys(other).sort();
    while (true) {
      if (theseKeys.length === 0) { return true; }
      if (otherKeys.length === 0) { return false; }
      var k = theseKeys.shift();
      var z = otherKeys.shift();
      if (k < z) { return true; }
      if (k > z) { return false; }
      if (!equals(this$1[k], other[k])) { return lte(this$1[k], other[k]); }
    }
  }

  //  Object$prototype$concat :: StrMap a ~> StrMap a -> StrMap a
  function Object$prototype$concat(other) {
    var this$1 = this;

    var result = {};
    for (var k in this$1) { result[k] = this$1[k]; }
    for (k in other) { result[k] = other[k]; }
    return result;
  }

  //  Object$prototype$map :: StrMap a ~> (a -> b) -> StrMap b
  function Object$prototype$map(f) {
    var this$1 = this;

    var result = {};
    for (var k in this$1) { result[k] = f(this$1[k]); }
    return result;
  }

  //  Object$prototype$ap :: StrMap a ~> StrMap (a -> b) -> StrMap b
  function Object$prototype$ap(other) {
    var this$1 = this;

    var result = {};
    for (var k in this$1) { if (k in other) { result[k] = other[k](this$1[k]); } }
    return result;
  }

  //  Object$prototype$alt :: StrMap a ~> StrMap a -> StrMap a
  var Object$prototype$alt = Object$prototype$concat;

  //  Object$prototype$reduce :: StrMap a ~> ((b, a) -> b, b) -> b
  function Object$prototype$reduce(f, initial) {
    var self = this;
    function reducer(acc, k) { return f(acc, self[k]); }
    return Object.keys(this).sort().reduce(reducer, initial);
  }

  //  Object$prototype$traverse :: Applicative f => StrMap a ~> (TypeRep f, a -> f b) -> f (StrMap b)
  function Object$prototype$traverse(typeRep, f) {
    var self = this;
    return Object.keys(this).reduce(function(applicative, k) {
      function set(o) { return function(v) { o[k] = v; return o; }; }
      return lift2(set, applicative, f(self[k]));
    }, of(typeRep, {}));
  }

  //  Function$id :: () -> a -> a
  function Function$id() {
    return identity;
  }

  //  Function$of :: b -> (a -> b)
  function Function$of(x) {
    return function(_) { return x; };
  }

  //  Function$chainRec :: ((a -> c, b -> c, a) -> (z -> c), a) -> (z -> b)
  function Function$chainRec(f, x) {
    return function(a) {
      var step = iterationNext(x);
      while (!step.done) {
        step = f(iterationNext, iterationDone, step.value)(a);
      }
      return step.value;
    };
  }

  //  Function$prototype$equals :: Function ~> Function -> Boolean
  function Function$prototype$equals(other) {
    return other === this;
  }

  //  Function$prototype$compose :: (a -> b) ~> (b -> c) -> (a -> c)
  function Function$prototype$compose(other) {
    var semigroupoid = this;
    return function(x) { return other(semigroupoid(x)); };
  }

  //  Function$prototype$map :: (a -> b) ~> (b -> c) -> (a -> c)
  function Function$prototype$map(f) {
    var functor = this;
    return function(x) { return f(functor(x)); };
  }

  //  Function$prototype$promap :: (b -> c) ~> (a -> b, c -> d) -> (a -> d)
  function Function$prototype$promap(f, g) {
    var profunctor = this;
    return function(x) { return g(profunctor(f(x))); };
  }

  //  Function$prototype$ap :: (a -> b) ~> (a -> b -> c) -> (a -> c)
  function Function$prototype$ap(f) {
    var apply = this;
    return function(x) { return f(x)(apply(x)); };
  }

  //  Function$prototype$chain :: (a -> b) ~> (b -> a -> c) -> (a -> c)
  function Function$prototype$chain(f) {
    var chain = this;
    return function(x) { return f(chain(x))(x); };
  }

  //  Function$prototype$contramap :: (b -> c) ~> (a -> b) -> (a -> c)
  function Function$prototype$contramap(f) {
    var contravariant = this;
    return function(x) { return contravariant(f(x)); };
  }

  /* eslint-disable key-spacing */
  var implementations = {
    Null: {
      prototype: {
        toString:                   Null$prototype$toString,
        'fantasy-land/equals':      Null$prototype$equals,
        'fantasy-land/lte':         Null$prototype$lte
      }
    },
    Undefined: {
      prototype: {
        toString:                   Undefined$prototype$toString,
        'fantasy-land/equals':      Undefined$prototype$equals,
        'fantasy-land/lte':         Undefined$prototype$lte
      }
    },
    Boolean: {
      prototype: {
        toString:                   Boolean$prototype$toString,
        'fantasy-land/equals':      Boolean$prototype$equals,
        'fantasy-land/lte':         Boolean$prototype$lte
      }
    },
    Number: {
      prototype: {
        toString:                   Number$prototype$toString,
        'fantasy-land/equals':      Number$prototype$equals,
        'fantasy-land/lte':         Number$prototype$lte
      }
    },
    Date: {
      prototype: {
        toString:                   Date$prototype$toString,
        'fantasy-land/equals':      Date$prototype$equals,
        'fantasy-land/lte':         Date$prototype$lte
      }
    },
    RegExp: {
      prototype: {
        'fantasy-land/equals':      RegExp$prototype$equals
      }
    },
    String: {
      'fantasy-land/empty':         String$empty,
      prototype: {
        toString:                   String$prototype$toString,
        'fantasy-land/equals':      String$prototype$equals,
        'fantasy-land/lte':         String$prototype$lte,
        'fantasy-land/concat':      String$prototype$concat
      }
    },
    Array: {
      'fantasy-land/empty':         Array$empty,
      'fantasy-land/of':            Array$of,
      'fantasy-land/chainRec':      Array$chainRec,
      'fantasy-land/zero':          Array$zero,
      prototype: {
        toString:                   Array$prototype$toString,
        'fantasy-land/equals':      Array$prototype$equals,
        'fantasy-land/lte':         Array$prototype$lte,
        'fantasy-land/concat':      Array$prototype$concat,
        'fantasy-land/map':         Array$prototype$map,
        'fantasy-land/ap':          Array$prototype$ap,
        'fantasy-land/chain':       Array$prototype$chain,
        'fantasy-land/alt':         Array$prototype$alt,
        'fantasy-land/reduce':      Array$prototype$reduce,
        'fantasy-land/traverse':    Array$prototype$traverse,
        'fantasy-land/extend':      Array$prototype$extend
      }
    },
    Arguments: {
      prototype: {
        toString:                   Arguments$prototype$toString,
        'fantasy-land/equals':      Arguments$prototype$equals,
        'fantasy-land/lte':         Arguments$prototype$lte
      }
    },
    Error: {
      prototype: {
        toString:                   Error$prototype$toString,
        'fantasy-land/equals':      Error$prototype$equals
      }
    },
    Object: {
      'fantasy-land/empty':         Object$empty,
      'fantasy-land/zero':          Object$zero,
      prototype: {
        toString:                   Object$prototype$toString,
        'fantasy-land/equals':      Object$prototype$equals,
        'fantasy-land/lte':         Object$prototype$lte,
        'fantasy-land/concat':      Object$prototype$concat,
        'fantasy-land/map':         Object$prototype$map,
        'fantasy-land/ap':          Object$prototype$ap,
        'fantasy-land/alt':         Object$prototype$alt,
        'fantasy-land/reduce':      Object$prototype$reduce,
        'fantasy-land/traverse':    Object$prototype$traverse
      }
    },
    Function: {
      'fantasy-land/id':            Function$id,
      'fantasy-land/of':            Function$of,
      'fantasy-land/chainRec':      Function$chainRec,
      prototype: {
        'fantasy-land/equals':      Function$prototype$equals,
        'fantasy-land/compose':     Function$prototype$compose,
        'fantasy-land/map':         Function$prototype$map,
        'fantasy-land/promap':      Function$prototype$promap,
        'fantasy-land/ap':          Function$prototype$ap,
        'fantasy-land/chain':       Function$prototype$chain,
        'fantasy-land/contramap':   Function$prototype$contramap
      }
    }
  };
  /* eslint-enable key-spacing */

  //# toString :: a -> String
  //.
  //. Returns a useful string representation of its argument.
  //.
  //. Dispatches to the argument's `toString` method if appropriate.
  //.
  //. Where practical, `equals(eval(toString(x)), x) = true`.
  //.
  //. `toString` implementations are provided for the following built-in types:
  //. Null, Undefined, Boolean, Number, Date, String, Array, Arguments, Error,
  //. and Object.
  //.
  //. ```javascript
  //. > toString(-0)
  //. '-0'
  //.
  //. > toString(['foo', 'bar', 'baz'])
  //. '["foo", "bar", "baz"]'
  //.
  //. > toString({x: 1, y: 2, z: 3})
  //. '{"x": 1, "y": 2, "z": 3}'
  //.
  //. > toString(Cons(1, Cons(2, Cons(3, Nil))))
  //. 'Cons(1, Cons(2, Cons(3, Nil)))'
  //. ```
  var toString = (function() {
    //  $seen :: Array Any
    var $seen = [];

    function call(method, x) {
      $seen.push(x);
      try { return method.call(x); } finally { $seen.pop(); }
    }

    return function toString(x) {
      if ($seen.indexOf(x) >= 0) { return '<Circular>'; }

      var xType = type(x);
      if (xType === 'Object') {
        var result;
        try { result = call(x.toString, x); } catch (err) {}
        if (result != null && result !== '[object Object]') { return result; }
      }

      return call(implPath([xType, 'prototype', 'toString']) || x.toString, x);
    };
  }());

  //# equals :: (a, b) -> Boolean
  //.
  //. Returns `true` if its arguments are of the same type and equal according
  //. to the type's [`fantasy-land/equals`][] method; `false` otherwise.
  //.
  //. `fantasy-land/equals` implementations are provided for the following
  //. built-in types: Null, Undefined, Boolean, Number, Date, RegExp, String,
  //. Array, Arguments, Error, Object, and Function.
  //.
  //. The algorithm supports circular data structures. Two arrays are equal
  //. if they have the same index paths and for each path have equal values.
  //. Two arrays which represent `[1, [1, [1, [1, [1, ...]]]]]`, for example,
  //. are equal even if their internal structures differ. Two objects are equal
  //. if they have the same property paths and for each path have equal values.
  //.
  //. ```javascript
  //. > equals(0, -0)
  //. true
  //.
  //. > equals(NaN, NaN)
  //. true
  //.
  //. > equals(Cons('foo', Cons('bar', Nil)), Cons('foo', Cons('bar', Nil)))
  //. true
  //.
  //. > equals(Cons('foo', Cons('bar', Nil)), Cons('bar', Cons('foo', Nil)))
  //. false
  //. ```
  var equals = (function() {
    //  $pairs :: Array (Pair Any Any)
    var $pairs = [];

    return function equals(x, y) {
      if (!sameType(x, y)) { return false; }

      //  This algorithm for comparing circular data structures was
      //  suggested in <http://stackoverflow.com/a/40622794/312785>.
      if ($pairs.some(function(p) { return p[0] === x && p[1] === y; })) {
        return true;
      }

      $pairs.push([x, y]);
      try {
        return Setoid.test(x) && Setoid.test(y) && Setoid.methods.equals(x)(y);
      } finally {
        $pairs.pop();
      }
    };
  }());

  //# lt :: (a, b) -> Boolean
  //.
  //. Returns `true` if its arguments are of the same type and the first is
  //. less than the second according to the type's [`fantasy-land/lte`][]
  //. method; `false` otherwise.
  //.
  //. This function is derived from [`lte`](#lte).
  //.
  //. See also [`gt`](#gt) and [`gte`](#gte).
  //.
  //. ```javascript
  //. > lt(0, 0)
  //. false
  //.
  //. > lt(0, 1)
  //. true
  //.
  //. > lt(1, 0)
  //. false
  //. ```
  function lt(x, y) {
    return sameType(x, y) && !lte(y, x);
  }

  //# lte :: (a, b) -> Boolean
  //.
  //. Returns `true` if its arguments are of the same type and the first
  //. is less than or equal to the second according to the type's
  //. [`fantasy-land/lte`][] method; `false` otherwise.
  //.
  //. `fantasy-land/lte` implementations are provided for the following
  //. built-in types: Null, Undefined, Boolean, Number, Date, String, Array,
  //. Arguments, and Object.
  //.
  //. The algorithm supports circular data structures in the same manner as
  //. [`equals`](#equals).
  //.
  //. See also [`lt`](#lt), [`gt`](#gt), and [`gte`](#gte).
  //.
  //. ```javascript
  //. > lte(0, 0)
  //. true
  //.
  //. > lte(0, 1)
  //. true
  //.
  //. > lte(1, 0)
  //. false
  //. ```
  var lte = (function() {
    //  $pairs :: Array (Pair Any Any)
    var $pairs = [];

    return function lte(x, y) {
      if (!sameType(x, y)) { return false; }

      //  This algorithm for comparing circular data structures was
      //  suggested in <http://stackoverflow.com/a/40622794/312785>.
      if ($pairs.some(function(p) { return p[0] === x && p[1] === y; })) {
        return equals(x, y);
      }

      $pairs.push([x, y]);
      try {
        return Ord.test(x) && Ord.test(y) && Ord.methods.lte(x)(y);
      } finally {
        $pairs.pop();
      }
    };
  }());

  //# gt :: (a, b) -> Boolean
  //.
  //. Returns `true` if its arguments are of the same type and the first is
  //. greater than the second according to the type's [`fantasy-land/lte`][]
  //. method; `false` otherwise.
  //.
  //. This function is derived from [`lte`](#lte).
  //.
  //. See also [`lt`](#lt) and [`gte`](#gte).
  //.
  //. ```javascript
  //. > gt(0, 0)
  //. false
  //.
  //. > gt(0, 1)
  //. false
  //.
  //. > gt(1, 0)
  //. true
  //. ```
  function gt(x, y) {
    return lt(y, x);
  }

  //# gte :: (a, b) -> Boolean
  //.
  //. Returns `true` if its arguments are of the same type and the first
  //. is greater than or equal to the second according to the type's
  //. [`fantasy-land/lte`][] method; `false` otherwise.
  //.
  //. This function is derived from [`lte`](#lte).
  //.
  //. See also [`lt`](#lt) and [`gt`](#gt).
  //.
  //. ```javascript
  //. > gte(0, 0)
  //. true
  //.
  //. > gte(0, 1)
  //. false
  //.
  //. > gte(1, 0)
  //. true
  //. ```
  function gte(x, y) {
    return lte(y, x);
  }

  //# compose :: Semigroupoid c => (c j k, c i j) -> c i k
  //.
  //. Function wrapper for [`fantasy-land/compose`][].
  //.
  //. `fantasy-land/compose` implementations are provided for the following
  //. built-in types: Function.
  //.
  //. ```javascript
  //. > compose(Math.sqrt, x => x + 1)(99)
  //. 10
  //. ```
  function compose(x, y) {
    return Semigroupoid.methods.compose(y)(x);
  }

  //# id :: Category c => TypeRep c -> c
  //.
  //. Function wrapper for [`fantasy-land/id`][].
  //.
  //. `fantasy-land/id` implementations are provided for the following
  //. built-in types: Function.
  //.
  //. ```javascript
  //. > id(Function)('foo')
  //. 'foo'
  //. ```
  function id(typeRep) {
    return Category.methods.id(typeRep)();
  }

  //# concat :: Semigroup a => (a, a) -> a
  //.
  //. Function wrapper for [`fantasy-land/concat`][].
  //.
  //. `fantasy-land/concat` implementations are provided for the following
  //. built-in types: String, Array, and Object.
  //.
  //. ```javascript
  //. > concat('abc', 'def')
  //. 'abcdef'
  //.
  //. > concat([1, 2, 3], [4, 5, 6])
  //. [1, 2, 3, 4, 5, 6]
  //.
  //. > concat({x: 1, y: 2}, {y: 3, z: 4})
  //. {x: 1, y: 3, z: 4}
  //.
  //. > concat(Cons('foo', Cons('bar', Cons('baz', Nil))), Cons('quux', Nil))
  //. Cons('foo', Cons('bar', Cons('baz', Cons('quux', Nil))))
  //. ```
  function concat(x, y) {
    return Semigroup.methods.concat(x)(y);
  }

  //# empty :: Monoid m => TypeRep m -> m
  //.
  //. Function wrapper for [`fantasy-land/empty`][].
  //.
  //. `fantasy-land/empty` implementations are provided for the following
  //. built-in types: String, Array, and Object.
  //.
  //. ```javascript
  //. > empty(String)
  //. ''
  //.
  //. > empty(Array)
  //. []
  //.
  //. > empty(Object)
  //. {}
  //.
  //. > empty(List)
  //. Nil
  //. ```
  function empty(typeRep) {
    return Monoid.methods.empty(typeRep)();
  }

  //# map :: Functor f => (a -> b, f a) -> f b
  //.
  //. Function wrapper for [`fantasy-land/map`][].
  //.
  //. `fantasy-land/map` implementations are provided for the following
  //. built-in types: Array, Object, and Function.
  //.
  //. ```javascript
  //. > map(Math.sqrt, [1, 4, 9])
  //. [1, 2, 3]
  //.
  //. > map(Math.sqrt, {x: 1, y: 4, z: 9})
  //. {x: 1, y: 2, z: 3}
  //.
  //. > map(Math.sqrt, s => s.length)('Sanctuary')
  //. 3
  //.
  //. > map(Math.sqrt, Tuple('foo', 64))
  //. Tuple('foo', 8)
  //.
  //. > map(Math.sqrt, Nil)
  //. Nil
  //.
  //. > map(Math.sqrt, Cons(1, Cons(4, Cons(9, Nil))))
  //. Cons(1, Cons(2, Cons(3, Nil)))
  //. ```
  function map(f, functor) {
    return Functor.methods.map(functor)(f);
  }

  //# bimap :: Bifunctor f => (a -> b, c -> d, f a c) -> f b d
  //.
  //. Function wrapper for [`fantasy-land/bimap`][].
  //.
  //. ```javascript
  //. > bimap(s => s.toUpperCase(), Math.sqrt, Tuple('foo', 64))
  //. Tuple('FOO', 8)
  //. ```
  function bimap(f, g, bifunctor) {
    return Bifunctor.methods.bimap(bifunctor)(f, g);
  }

  //# promap :: Profunctor p => (a -> b, c -> d, p b c) -> p a d
  //.
  //. Function wrapper for [`fantasy-land/promap`][].
  //.
  //. `fantasy-land/promap` implementations are provided for the following
  //. built-in types: Function.
  //.
  //. ```javascript
  //. > promap(Math.abs, x => x + 1, Math.sqrt)(-100)
  //. 11
  //. ```
  function promap(f, g, profunctor) {
    return Profunctor.methods.promap(profunctor)(f, g);
  }

  //# ap :: Apply f => (f (a -> b), f a) -> f b
  //.
  //. Function wrapper for [`fantasy-land/ap`][].
  //.
  //. `fantasy-land/ap` implementations are provided for the following
  //. built-in types: Array, Object, and Function.
  //.
  //. ```javascript
  //. > ap([Math.sqrt, x => x * x], [1, 4, 9, 16, 25])
  //. [1, 2, 3, 4, 5, 1, 16, 81, 256, 625]
  //.
  //. > ap({a: Math.sqrt, b: x => x * x}, {a: 16, b: 10, c: 1})
  //. {a: 4, b: 100}
  //.
  //. > ap(s => n => s.slice(0, n), s => Math.ceil(s.length / 2))('Haskell')
  //. 'Hask'
  //.
  //. > ap(Identity(Math.sqrt), Identity(64))
  //. Identity(8)
  //.
  //. > ap(Cons(Math.sqrt, Cons(x => x * x, Nil)), Cons(16, Cons(100, Nil)))
  //. Cons(4, Cons(10, Cons(256, Cons(10000, Nil))))
  //. ```
  function ap(applyF, applyX) {
    return Apply.methods.ap(applyX)(applyF);
  }

  //# lift2 :: Apply f => (a -> b -> c, f a, f b) -> f c
  //.
  //. Lifts `a -> b -> c` to `Apply f => f a -> f b -> f c` and returns the
  //. result of applying this to the given arguments.
  //.
  //. This function is derived from [`map`](#map) and [`ap`](#ap).
  //.
  //. See also [`lift3`](#lift3).
  //.
  //. ```javascript
  //. > lift2(x => y => Math.pow(x, y), [10], [1, 2, 3])
  //. [10, 100, 1000]
  //.
  //. > lift2(x => y => Math.pow(x, y), Identity(10), Identity(3))
  //. Identity(1000)
  //. ```
  function lift2(f, x, y) {
    return ap(map(f, x), y);
  }

  //# lift3 :: Apply f => (a -> b -> c -> d, f a, f b, f c) -> f d
  //.
  //. Lifts `a -> b -> c -> d` to `Apply f => f a -> f b -> f c -> f d` and
  //. returns the result of applying this to the given arguments.
  //.
  //. This function is derived from [`map`](#map) and [`ap`](#ap).
  //.
  //. See also [`lift2`](#lift2).
  //.
  //. ```javascript
  //. > lift3(x => y => z => x + z + y, ['<'], ['>'], ['foo', 'bar', 'baz'])
  //. ['<foo>', '<bar>', '<baz>']
  //.
  //. > lift3(x => y => z => x + z + y, Identity('<'), Identity('>'), Identity('baz'))
  //. Identity('<baz>')
  //. ```
  function lift3(f, x, y, z) {
    return ap(ap(map(f, x), y), z);
  }

  //# apFirst :: Apply f => (f a, f b) -> f a
  //.
  //. Combines two effectful actions, keeping only the result of the first.
  //. Equivalent to Haskell's `(<*)` function.
  //.
  //. This function is derived from [`lift2`](#lift2).
  //.
  //. See also [`apSecond`](#apSecond).
  //.
  //. ```javascript
  //. > apFirst([1, 2], [3, 4])
  //. [1, 1, 2, 2]
  //.
  //. > apFirst(Identity(1), Identity(2))
  //. Identity(1)
  //. ```
  function apFirst(x, y) {
    return lift2(constant, x, y);
  }

  //# apSecond :: Apply f => (f a, f b) -> f b
  //.
  //. Combines two effectful actions, keeping only the result of the second.
  //. Equivalent to Haskell's `(*>)` function.
  //.
  //. This function is derived from [`lift2`](#lift2).
  //.
  //. See also [`apFirst`](#apFirst).
  //.
  //. ```javascript
  //. > apSecond([1, 2], [3, 4])
  //. [3, 4, 3, 4]
  //.
  //. > apSecond(Identity(1), Identity(2))
  //. Identity(2)
  //. ```
  function apSecond(x, y) {
    return lift2(constant(identity), x, y);
  }

  //# of :: Applicative f => (TypeRep f, a) -> f a
  //.
  //. Function wrapper for [`fantasy-land/of`][].
  //.
  //. `fantasy-land/of` implementations are provided for the following
  //. built-in types: Array and Function.
  //.
  //. ```javascript
  //. > of(Array, 42)
  //. [42]
  //.
  //. > of(Function, 42)(null)
  //. 42
  //.
  //. > of(List, 42)
  //. Cons(42, Nil)
  //. ```
  function of(typeRep, x) {
    return Applicative.methods.of(typeRep)(x);
  }

  //# chain :: Chain m => (a -> m b, m a) -> m b
  //.
  //. Function wrapper for [`fantasy-land/chain`][].
  //.
  //. `fantasy-land/chain` implementations are provided for the following
  //. built-in types: Array and Function.
  //.
  //. ```javascript
  //. > chain(x => [x, x], [1, 2, 3])
  //. [1, 1, 2, 2, 3, 3]
  //.
  //. > chain(x => x % 2 == 1 ? of(List, x) : Nil, Cons(1, Cons(2, Cons(3, Nil))))
  //. Cons(1, Cons(3, Nil))
  //.
  //. > chain(n => s => s.slice(0, n), s => Math.ceil(s.length / 2))('Haskell')
  //. 'Hask'
  //. ```
  function chain(f, chain_) {
    return Chain.methods.chain(chain_)(f);
  }

  //# join :: Chain m => m (m a) -> m a
  //.
  //. Removes one level of nesting from a nested monadic structure.
  //.
  //. This function is derived from [`chain`](#chain).
  //.
  //. ```javascript
  //. > join([[1], [2], [3]])
  //. [1, 2, 3]
  //.
  //. > join([[[1, 2, 3]]])
  //. [[1, 2, 3]]
  //.
  //. > join(Identity(Identity(1)))
  //. Identity(1)
  //. ```
  function join(chain_) {
    return chain(identity, chain_);
  }

  //# chainRec :: ChainRec m => (TypeRep m, (a -> c, b -> c, a) -> m c, a) -> m b
  //.
  //. Function wrapper for [`fantasy-land/chainRec`][].
  //.
  //. `fantasy-land/chainRec` implementations are provided for the following
  //. built-in types: Array.
  //.
  //. ```javascript
  //. > chainRec(
  //. .   Array,
  //. .   (next, done, s) => s.length == 2 ? [s + '!', s + '?'].map(done)
  //. .                                    : [s + 'o', s + 'n'].map(next),
  //. .   ''
  //. . )
  //. ['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']
  //. ```
  function chainRec(typeRep, f, x) {
    return ChainRec.methods.chainRec(typeRep)(f, x);
  }

  //# filter :: (Applicative f, Foldable f, Monoid (f a)) => (a -> Boolean, f a) -> f a
  //.
  //. Filters its second argument in accordance with the given predicate.
  //.
  //. This function is derived from [`concat`](#concat), [`empty`](#empty),
  //. [`of`](#of), and [`reduce`](#reduce).
  //.
  //. See also [`filterM`](#filterM).
  //.
  //. ```javascript
  //. > filter(x => x % 2 == 1, [1, 2, 3])
  //. [1, 3]
  //.
  //. > filter(x => x % 2 == 1, Cons(1, Cons(2, Cons(3, Nil))))
  //. Cons(1, Cons(3, Nil))
  //. ```
  function filter(pred, m) {
    var M = m.constructor;
    return reduce(function(m, x) { return pred(x) ? concat(m, of(M, x)) : m; },
                  empty(M),
                  m);
  }

  //# filterM :: (Alternative m, Monad m) => (a -> Boolean, m a) -> m a
  //.
  //. Filters its second argument in accordance with the given predicate.
  //.
  //. This function is derived from [`of`](#of), [`chain`](#chain), and
  //. [`zero`](#zero).
  //.
  //. See also [`filter`](#filter).
  //.
  //. ```javascript
  //. > filterM(x => x % 2 == 1, [1, 2, 3])
  //. [1, 3]
  //.
  //. > filterM(x => x % 2 == 1, Cons(1, Cons(2, Cons(3, Nil))))
  //. Cons(1, Cons(3, Nil))
  //.
  //. > filterM(x => x % 2 == 1, Nothing)
  //. Nothing
  //.
  //. > filterM(x => x % 2 == 1, Just(0))
  //. Nothing
  //.
  //. > filterM(x => x % 2 == 1, Just(1))
  //. Just(1)
  //. ```
  function filterM(pred, m) {
    var M = m.constructor;
    var z = zero(M);
    return chain(function(x) { return pred(x) ? of(M, x) : z; }, m);
  }

  //# alt :: Alt f => (f a, f a) -> f a
  //.
  //. Function wrapper for [`fantasy-land/alt`][].
  //.
  //. `fantasy-land/alt` implementations are provided for the following
  //. built-in types: Array and Object.
  //.
  //. ```javascript
  //. > alt([1, 2, 3], [4, 5, 6])
  //. [1, 2, 3, 4, 5, 6]
  //.
  //. > alt(Nothing, Nothing)
  //. Nothing
  //.
  //. > alt(Nothing, Just(1))
  //. Just(1)
  //.
  //. > alt(Just(2), Just(3))
  //. Just(2)
  //. ```
  function alt(x, y) {
    return Alt.methods.alt(x)(y);
  }

  //# zero :: Plus f => TypeRep f -> f a
  //.
  //. Function wrapper for [`fantasy-land/zero`][].
  //.
  //. `fantasy-land/zero` implementations are provided for the following
  //. built-in types: Array and Object.
  //.
  //. ```javascript
  //. > zero(Array)
  //. []
  //.
  //. > zero(Object)
  //. {}
  //.
  //. > zero(Maybe)
  //. Nothing
  //. ```
  function zero(typeRep) {
    return Plus.methods.zero(typeRep)();
  }

  //# reduce :: Foldable f => ((b, a) -> b, b, f a) -> b
  //.
  //. Function wrapper for [`fantasy-land/reduce`][].
  //.
  //. `fantasy-land/reduce` implementations are provided for the following
  //. built-in types: Array and Object.
  //.
  //. ```javascript
  //. > reduce((xs, x) => [x].concat(xs), [], [1, 2, 3])
  //. [3, 2, 1]
  //.
  //. > reduce(concat, '', Cons('foo', Cons('bar', Cons('baz', Nil))))
  //. 'foobarbaz'
  //. ```
  function reduce(f, x, foldable) {
    return Foldable.methods.reduce(foldable)(f, x);
  }

  //# traverse :: (Applicative f, Traversable t) => (TypeRep f, a -> f b, t a) -> f (t b)
  //.
  //. Function wrapper for [`fantasy-land/traverse`][].
  //.
  //. `fantasy-land/traverse` implementations are provided for the following
  //. built-in types: Array and Object.
  //.
  //. See also [`sequence`](#sequence).
  //.
  //. ```javascript
  //. > traverse(Array, x => x, [[1, 2, 3], [4, 5]])
  //. [[1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]]
  //.
  //. > traverse(Identity, x => Identity(x + 1), [1, 2, 3])
  //. Identity([2, 3, 4])
  //. ```
  function traverse(typeRep, f, traversable) {
    return Traversable.methods.traverse(traversable)(typeRep, f);
  }

  //# sequence :: (Applicative f, Traversable t) => (TypeRep f, t (f a)) -> f (t a)
  //.
  //. Inverts the given `t (f a)` to produce an `f (t a)`.
  //.
  //. This function is derived from [`traverse`](#traverse).
  //.
  //. ```javascript
  //. > sequence(Array, Identity([1, 2, 3]))
  //. [Identity(1), Identity(2), Identity(3)]
  //.
  //. > sequence(Identity, [Identity(1), Identity(2), Identity(3)])
  //. Identity([1, 2, 3])
  //. ```
  function sequence(typeRep, traversable) {
    return traverse(typeRep, identity, traversable);
  }

  //# extend :: Extend w => (w a -> b, w a) -> w b
  //.
  //. Function wrapper for [`fantasy-land/extend`][].
  //.
  //. `fantasy-land/extend` implementations are provided for the following
  //. built-in types: Array.
  //.
  //. ```javascript
  //. > extend(ss => ss.join(''), ['x', 'y', 'z'])
  //. ['xyz', 'yz', 'z']
  //. ```
  function extend(f, extend_) {
    return Extend.methods.extend(extend_)(f);
  }

  //# extract :: Comonad w => w a -> a
  //.
  //. Function wrapper for [`fantasy-land/extract`][].
  //.
  //. ```javascript
  //. > extract(Identity(42))
  //. 42
  //. ```
  function extract(comonad) {
    return Comonad.methods.extract(comonad)();
  }

  //# contramap :: Contravariant f => (b -> a, f a) -> f b
  //.
  //. Function wrapper for [`fantasy-land/contramap`][].
  //.
  //. `fantasy-land/contramap` implementations are provided for the following
  //. built-in types: Function.
  //.
  //. ```javascript
  //. > contramap(s => s.length, Math.sqrt)('Sanctuary')
  //. 3
  //. ```
  function contramap(f, contravariant) {
    return Contravariant.methods.contramap(contravariant)(f);
  }

  return {
    TypeClass: TypeClass,
    Setoid: Setoid,
    Ord: Ord,
    Semigroupoid: Semigroupoid,
    Category: Category,
    Semigroup: Semigroup,
    Monoid: Monoid,
    Functor: Functor,
    Bifunctor: Bifunctor,
    Profunctor: Profunctor,
    Apply: Apply,
    Applicative: Applicative,
    Chain: Chain,
    ChainRec: ChainRec,
    Monad: Monad,
    Alt: Alt,
    Plus: Plus,
    Alternative: Alternative,
    Foldable: Foldable,
    Traversable: Traversable,
    Extend: Extend,
    Comonad: Comonad,
    Contravariant: Contravariant,
    toString: toString,
    equals: equals,
    lt: lt,
    lte: lte,
    gt: gt,
    gte: gte,
    compose: compose,
    id: id,
    concat: concat,
    empty: empty,
    map: map,
    bimap: bimap,
    promap: promap,
    ap: ap,
    lift2: lift2,
    lift3: lift3,
    apFirst: apFirst,
    apSecond: apSecond,
    of: of,
    chain: chain,
    join: join,
    chainRec: chainRec,
    filter: filter,
    filterM: filterM,
    alt: alt,
    zero: zero,
    reduce: reduce,
    traverse: traverse,
    sequence: sequence,
    extend: extend,
    extract: extract,
    contramap: contramap
  };

}));

//. [Alt]:                      https://github.com/fantasyland/fantasy-land#alt
//. [Alternative]:              https://github.com/fantasyland/fantasy-land#alternative
//. [Applicative]:              https://github.com/fantasyland/fantasy-land#applicative
//. [Apply]:                    https://github.com/fantasyland/fantasy-land#apply
//. [Bifunctor]:                https://github.com/fantasyland/fantasy-land#bifunctor
//. [Category]:                 https://github.com/fantasyland/fantasy-land#category
//. [Chain]:                    https://github.com/fantasyland/fantasy-land#chain
//. [ChainRec]:                 https://github.com/fantasyland/fantasy-land#chainrec
//. [Comonad]:                  https://github.com/fantasyland/fantasy-land#comonad
//. [Contravariant]:            https://github.com/fantasyland/fantasy-land#contravariant
//. [Extend]:                   https://github.com/fantasyland/fantasy-land#extend
//. [FL]:                       https://github.com/fantasyland/fantasy-land
//. [Foldable]:                 https://github.com/fantasyland/fantasy-land#foldable
//. [Functor]:                  https://github.com/fantasyland/fantasy-land#functor
//. [Monad]:                    https://github.com/fantasyland/fantasy-land#monad
//. [Monoid]:                   https://github.com/fantasyland/fantasy-land#monoid
//. [Ord]:                      https://github.com/fantasyland/fantasy-land#ord
//. [Plus]:                     https://github.com/fantasyland/fantasy-land#plus
//. [Profunctor]:               https://github.com/fantasyland/fantasy-land#profunctor
//. [Semigroup]:                https://github.com/fantasyland/fantasy-land#semigroup
//. [Semigroupoid]:             https://github.com/fantasyland/fantasy-land#semigroupoid
//. [Setoid]:                   https://github.com/fantasyland/fantasy-land#setoid
//. [Traversable]:              https://github.com/fantasyland/fantasy-land#traversable
//. [`fantasy-land/alt`]:       https://github.com/fantasyland/fantasy-land#alt-method
//. [`fantasy-land/ap`]:        https://github.com/fantasyland/fantasy-land#ap-method
//. [`fantasy-land/bimap`]:     https://github.com/fantasyland/fantasy-land#bimap-method
//. [`fantasy-land/chain`]:     https://github.com/fantasyland/fantasy-land#chain-method
//. [`fantasy-land/chainRec`]:  https://github.com/fantasyland/fantasy-land#chainrec-method
//. [`fantasy-land/compose`]:   https://github.com/fantasyland/fantasy-land#compose-method
//. [`fantasy-land/concat`]:    https://github.com/fantasyland/fantasy-land#concat-method
//. [`fantasy-land/contramap`]: https://github.com/fantasyland/fantasy-land#contramap-method
//. [`fantasy-land/empty`]:     https://github.com/fantasyland/fantasy-land#empty-method
//. [`fantasy-land/equals`]:    https://github.com/fantasyland/fantasy-land#equals-method
//. [`fantasy-land/extend`]:    https://github.com/fantasyland/fantasy-land#extend-method
//. [`fantasy-land/extract`]:   https://github.com/fantasyland/fantasy-land#extract-method
//. [`fantasy-land/id`]:        https://github.com/fantasyland/fantasy-land#id-method
//. [`fantasy-land/lte`]:       https://github.com/fantasyland/fantasy-land#lte-method
//. [`fantasy-land/map`]:       https://github.com/fantasyland/fantasy-land#map-method
//. [`fantasy-land/of`]:        https://github.com/fantasyland/fantasy-land#of-method
//. [`fantasy-land/promap`]:    https://github.com/fantasyland/fantasy-land#promap-method
//. [`fantasy-land/reduce`]:    https://github.com/fantasyland/fantasy-land#reduce-method
//. [`fantasy-land/traverse`]:  https://github.com/fantasyland/fantasy-land#traverse-method
//. [`fantasy-land/zero`]:      https://github.com/fantasyland/fantasy-land#zero-method
//. [type-classes]:             https://github.com/sanctuary-js/sanctuary-def#type-classes
});

var inspectF = createCommonjsModule(function (module) {
(function(global, f) {

  'use strict';

  /*istanbul ignore next*/
  {
    module.exports = f();
  }

}(/*istanbul ignore next*/(commonjsGlobal || window || commonjsGlobal), function() {

  'use strict';

  function checkn(n) {
    if(typeof n !== 'number') {
      throw new TypeError(
        'inspectf expects its first argument to be a number'
      );
    }
  }

  function checkf(f) {
    if(typeof f !== 'function') {
      throw new TypeError(
        'inspectf expects its second argument to be a function'
      );
    }
  }

  var RSPACE = /^ */;
  var RCODE = /\s*[^\s]/;
  var RTABS = /\t/g;
  var REOL = /\n\r?/;

  function isCode(line) {
    return RCODE.test(line);
  }

  function getPadding(line) {
    return line.match(RSPACE)[0].length;
  }

  function guessIndentation(lines) {
    var filtered = lines.filter(isCode);
    var paddings = filtered.map(getPadding);
    var depth = paddings.reduce(Math.min, Infinity);
    var tabsize = paddings
    .map(function(x) { return x - depth; })
    .find(function(x) { return x > 1; }) || 2;
    return {depth: depth, tabsize: tabsize};
  }

  function pad(n) {
    return (new Array(n + 1)).join(' ');
  }

  function show(f, indentation) {
    return f.toString().replace(RTABS, indentation);
  }

  function toLines(s) {
    return s.split(REOL);
  }

  function fixIndentation(lines, indentation) {
    var info = guessIndentation(lines.slice(1));
    var RPAD = new RegExp(pad(info.tabsize), 'g');
    return lines.map(function(line) {
      return line.slice(Math.min(info.depth, getPadding(line)))
      .replace(RPAD, '\t').replace(RTABS, indentation);
    }).join('\n');
  }

  return function inspectf(n, f) {
    checkn(n);
    if(arguments.length < 2) {
      return function inspectf$partial(f) { return inspectf(n, f); };
    }
    checkf(f);
    if(f.toString !== Function.prototype.toString) {return f.toString();}
    var i = pad(n), shown = show(f, i), lines = toLines(shown, i);
    if(lines.length < 2) {return shown;}
    return fixIndentation(lines, i);
  };

}));
});

var noop = function noop(){};
var moop = function moop(){ return this };
var show = index$2.toString;
var padf = function (sf, s) { return s.replace(/^/gm, sf).replace(sf, ''); };
var showf = function (f) { return padf('  ', inspectF(2, f)); };

var mapArray = function (xs, f) {
  var l = xs.length, ys = new Array(l);
  for(var i = 0; i < l; i++) { ys[i] = f(xs[i], i, xs); }
  return ys;
};

var partial1 = function (f, a) { return function bound1(b, c, d){
  switch(arguments.length){
    case 1: return f(a, b);
    case 2: return f(a, b, c);
    default: return f(a, b, c, d);
  }
}; };

var partial2 = function (f, a, b) { return function bound2(c, d){
  return arguments.length === 1 ? f(a, b, c) : f(a, b, c, d);
}; };

var partial3 = function (f, a, b, c) { return function bound3(d){
  return f(a, b, c, d);
}; };

var escapeTick = function (f) { return function imprisoned(x){
  setTimeout(function escaped(){ f(x); }, 0);
}; };

var isFunction = function (f) { return typeof f === 'function'; };
var isThenable = function (m) { return m instanceof Promise || Boolean(m) && isFunction(m.then); };
var isBoolean = function (f) { return typeof f === 'boolean'; };
var isNumber = function (f) { return typeof f === 'number'; };
var isUnsigned = function (n) { return (n === Infinity || isNumber(n) && n > 0 && n % 1 === 0); };
var isObject = function (o) { return o !== null && typeof o === 'object'; };
var isIterator = function (i) { return isObject(i) && isFunction(i.next); };
var isArray = Array.isArray;

var FL = {
  map: 'fantasy-land/map',
  bimap: 'fantasy-land/bimap',
  chain: 'fantasy-land/chain',
  chainRec: 'fantasy-land/chainRec',
  ap: 'fantasy-land/ap',
  of: 'fantasy-land/of',
  zero: 'fantasy-land/zero'
};

var ordinal = ['first', 'second', 'third', 'fourth', 'fifth'];

var namespace = 'fluture';
var name = 'Future';
var version = 3;

var $$type = namespace + "/" + name + "@" + version;

var index$5 = createCommonjsModule(function (module) {
/*
        @@@@@@@            @@@@@@@         @@
      @@       @@        @@       @@      @@@
    @@   @@@ @@  @@    @@   @@@ @@  @@   @@@@@@ @@   @@@  @@ @@@      @@@@
   @@  @@   @@@   @@  @@  @@   @@@   @@   @@@   @@   @@@  @@@   @@  @@@   @@
   @@  @@   @@@   @@  @@  @@   @@@   @@   @@@   @@   @@@  @@@   @@  @@@@@@@@
   @@  @@   @@@  @@   @@  @@   @@@  @@    @@@   @@   @@@  @@@   @@  @@@
    @@   @@@ @@@@@     @@   @@@ @@@@@      @@@    @@@ @@  @@@@@@      @@@@@
      @@                 @@                           @@  @@
        @@@@@@@            @@@@@@@               @@@@@    @@
                                                          */
//. # sanctuary-type-identifiers
//.
//. A type is a set of values. Boolean, for example, is the type comprising
//. `true` and `false`. A value may be a member of multiple types (`42` is a
//. member of Number, PositiveNumber, Integer, and many other types).
//.
//. In certain situations it is useful to divide JavaScript values into
//. non-overlapping types. The language provides two constructs for this
//. purpose: the [`typeof`][1] operator and [`Object.prototype.toString`][2].
//. Each has pros and cons, but neither supports user-defined types.
//.
//. sanctuary-type-identifiers comprises:
//.
//.   - an npm and browser -compatible package for deriving the
//.     _type identifier_ of a JavaScript value; and
//.   - a specification which authors may follow to specify type
//.     identifiers for their types.
//.
//. ### Specification
//.
//. For a type to be compatible with the algorithm:
//.
//.   - every member of the type MUST have a `constructor` property
//.     pointing to an object known as the _type representative_;
//.
//.   - the type representative MUST have a `@@type` property
//.     (the _type identifier_); and
//.
//.   - the type identifier MUST be a string primitive and SHOULD have
//.     format `'<namespace>/<name>[@<version>]'`, where:
//.
//.       - `<namespace>` MUST consist of one or more characters, and
//.         SHOULD equal the name of the npm package which defines the
//.         type (including [scope][3] where appropriate);
//.
//.       - `<name>` MUST consist of one or more characters, and SHOULD
//.         be the unique name of the type; and
//.
//.       - `<version>` MUST consist of one or more digits, and SHOULD
//.         represent the version of the type.
//.
//. If the type identifier does not conform to the format specified above,
//. it is assumed that the entire string represents the _name_ of the type;
//. _namespace_ will be `null` and _version_ will be `0`.
//.
//. If the _version_ is not given, it is assumed to be `0`.
//.
//. For example:
//.
//. ```javascript
//. //  Identity :: a -> Identity a
//. function Identity(x) {
//.   if (!(this instanceof Identity)) return new Identity(x);
//.   this.value = x;
//. }
//.
//. Identity['@@type'] = 'my-package/Identity';
//. ```
//.
//. Note that by using a constructor function the `constructor` property is set
//. implicitly for each value created. Constructor functions are convenient for
//. this reason, but are not required. This definition is also valid:
//.
//. ```javascript
//. //  IdentityTypeRep :: TypeRep Identity
//. var IdentityTypeRep = {
//.   '@@type': 'my-package/Identity'
//. };
//.
//. //  Identity :: a -> Identity a
//. function Identity(x) {
//.   return {constructor: IdentityTypeRep, value: x};
//. }
//. ```

(function(f) {

  'use strict';

  {
    module.exports = f();
  }

}(function() {

  'use strict';

  //  $$type :: String
  var $$type = '@@type';

  //  pattern :: RegExp
  var pattern = new RegExp(
    '^'
  + '([\\s\\S]+)'   //  <namespace>
  + '/'             //  SOLIDUS (U+002F)
  + '([\\s\\S]+?)'  //  <name>
  + '(?:'           //  optional non-capturing group {
  +   '@'           //    COMMERCIAL AT (U+0040)
  +   '([0-9]+)'    //    <version>
  + ')?'            //  }
  + '$'
  );

  //. ### Usage
  //.
  //. ```javascript
  //. const type = require('sanctuary-type-identifiers');
  //. ```
  //.
  //. ```javascript
  //. > function Identity(x) {
  //. .   if (!(this instanceof Identity)) return new Identity(x);
  //. .   this.value = x;
  //. . }
  //. . Identity['@@type'] = 'my-package/Identity@1';
  //.
  //. > type.parse(type(Identity(0)))
  //. {namespace: 'my-package', name: 'Identity', version: 1}
  //. ```
  //.
  //. ### API
  //.
  //# type :: Any -> String
  //.
  //. Takes any value and returns a string which identifies its type. If the
  //. value conforms to the [specification][4], the custom type identifier is
  //. returned.
  //.
  //. ```javascript
  //. > type(null)
  //. 'Null'
  //.
  //. > type(true)
  //. 'Boolean'
  //.
  //. > type(Identity(0))
  //. 'my-package/Identity@1'
  //. ```
  function type(x) {
    return x != null &&
           x.constructor != null &&
           x.constructor.prototype !== x &&
           typeof x.constructor[$$type] === 'string' ?
      x.constructor[$$type] :
      Object.prototype.toString.call(x).slice('[object '.length, -']'.length);
  }

  //# type.parse :: String -> { namespace :: Nullable String, name :: String, version :: Number }
  //.
  //. Takes any string and parses it according to the [specification][4],
  //. returning an object with `namespace`, `name`, and `version` fields.
  //.
  //. ```javascript
  //. > type.parse('my-package/List@2')
  //. {namespace: 'my-package', name: 'List', version: 2}
  //.
  //. > type.parse('nonsense!')
  //. {namespace: null, name: 'nonsense!', version: 0}
  //.
  //. > type.parse(Identity['@@type'])
  //. {namespace: 'my-package', name: 'Identity', version: 1}
  //. ```
  type.parse = function parse(s) {
    var groups = pattern.exec(s);
    return {
      namespace: groups == null || groups[1] == null ? null : groups[1],
      name:      groups == null                      ? s    : groups[2],
      version:   groups == null || groups[3] == null ? 0    : Number(groups[3])
    };
  };

  return type;

}));

//. [1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
//. [2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
//. [3]: https://docs.npmjs.com/misc/scope
//. [4]: #specification
});

var error = function (message) {
  throw new Error(message);
};

var typeError = function (message) {
  throw new TypeError(message);
};

var invalidArgument = function (it, at, expected, actual) { return typeError(
  (it + " expects its " + (ordinal[at]) + " argument to " + expected + "\n  Actual: " + (show(actual)))
); };

var invalidContext = function (it, actual) { return typeError(
  it + " was invoked outside the context of a Future. You might want to use"
  + " a dispatcher instead\n  Called on: " + (show(actual))
); };

var invalidNamespace = function (m, x) { return (
  "The Future was not created by " + namespace + ". "
+ "Make sure you transform other Futures to " + namespace + " Futures. "
+ "Got " + (x ? ("a Future from " + x) : 'an unscoped Future') + "."
+ '\n  See: https://github.com/fluture-js/Fluture#casting-futures'
); };

var invalidVersion = function (m, x) { return (
  "The Future was created by " + (x < version ? 'an older' : 'a newer') + " version of " + namespace + ". "
+ 'This means that one of the sources which creates Futures is outdated. '
+ 'Update this source, or transform its created Futures to be compatible.'
+ '\n  See: https://github.com/fluture-js/Fluture#casting-futures'
); };

var invalidFuture = function (it, at, m, s) {
  if ( s === void 0 ) s = '';

  var id = index$5.parse(index$5(m));
  var info = id.name === name ? '\n' + (
    id.namespace !== namespace ? invalidNamespace(m, id.namespace)
  : id.version !== version ? invalidVersion(m, id.version)
  : 'Nothing seems wrong. Contact the Fluture maintainers.') : '';
  typeError(
    it + " expects " + (ordinal[at] ? ("its " + (ordinal[at]) + " argument to be a valid Future") : at) + "."
  + info + "\n  Actual: " + (show(m)) + " :: " + (id.name) + s
  );
};

/**
 * Custom implementation of a double ended queue.
 */
function Denque(array) {
  // circular buffer
  this._list = new Array(4);
  // bit mask
  this._capacityMask = 0x3;
  // next unread item
  this._head = 0;
  // next empty slot
  this._tail = 0;

  if (Array.isArray(array)) {
    this._fromArray(array);
  }
}

/**
 * -------------
 *  PUBLIC API
 * -------------
 */

/**
 * Returns the item at the specified index from the list.
 * 0 is the first element, 1 is the second, and so on...
 * Elements at negative values are that many from the end: -1 is one before the end
 * (the last element), -2 is two before the end (one before last), etc.
 * @param index
 * @returns {*}
 */
Denque.prototype.peekAt = function peekAt(index) {
  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  var len = this.size();
  if (i >= len || i < -len) { return undefined; }
  if (i < 0) { i += len; }
  i = (this._head + i) & this._capacityMask;
  return this._list[i];
};

/**
 * Alias for peakAt()
 * @param i
 * @returns {*}
 */
Denque.prototype.get = function get(i) {
  return this.peekAt(i);
};

/**
 * Returns the first item in the list without removing it.
 * @returns {*}
 */
Denque.prototype.peek = function peek() {
  if (this._head === this._tail) { return undefined; }
  return this._list[this._head];
};

/**
 * Alias for peek()
 * @returns {*}
 */
Denque.prototype.peekFront = function peekFront() {
  return this.peek();
};

/**
 * Returns the item that is at the back of the queue without removing it.
 * Uses peekAt(-1)
 */
Denque.prototype.peekBack = function peekBack() {
  return this.peekAt(-1);
};

/**
 * Returns the current length of the queue
 * @return {Number}
 */
Object.defineProperty(Denque.prototype, 'length', {
  get: function length() {
    return this.size();
  }
});

/**
 * Return the number of items on the list, or 0 if empty.
 * @returns {number}
 */
Denque.prototype.size = function size() {
  if (this._head === this._tail) { return 0; }
  if (this._head < this._tail) { return this._tail - this._head; }
  else { return this._capacityMask + 1 - (this._head - this._tail); }
};

/**
 * Add an item at the beginning of the list.
 * @param item
 */
Denque.prototype.unshift = function unshift(item) {
  if (item === undefined) { return this.length; }
  var len = this._list.length;
  this._head = (this._head - 1 + len) & this._capacityMask;
  this._list[this._head] = item;
  if (this._tail === this._head) { this._growArray(); }
  if (this._head < this._tail) { return this._tail - this._head; }
  else { return this._capacityMask + 1 - (this._head - this._tail); }
};

/**
 * Remove and return the first item on the list,
 * Returns undefined if the list is empty.
 * @returns {*}
 */
Denque.prototype.shift = function shift() {
  var head = this._head;
  if (head === this._tail) { return undefined; }
  var item = this._list[head];
  this._list[head] = undefined;
  this._head = (head + 1) & this._capacityMask;
  if (head < 2 && this._tail > 10000 && this._tail <= this._list.length >>> 2) { this._shrinkArray(); }
  return item;
};

/**
 * Add an item to the bottom of the list.
 * @param item
 */
Denque.prototype.push = function push(item) {
  if (item === undefined) { return this.length; }
  var tail = this._tail;
  this._list[tail] = item;
  this._tail = (tail + 1) & this._capacityMask;
  if (this._tail === this._head) {
    this._growArray();
  }

  if (this._head < this._tail) { return this._tail - this._head; }
  else { return this._capacityMask + 1 - (this._head - this._tail); }
};

/**
 * Remove and return the last item on the list.
 * Returns undefined if the list is empty.
 * @returns {*}
 */
Denque.prototype.pop = function pop() {
  var tail = this._tail;
  if (tail === this._head) { return undefined; }
  var len = this._list.length;
  this._tail = (tail - 1 + len) & this._capacityMask;
  var item = this._list[this._tail];
  this._list[this._tail] = undefined;
  if (this._head < 2 && tail > 10000 && tail <= len >>> 2) { this._shrinkArray(); }
  return item;
};

/**
 * Remove and return the item at the specified index from the list.
 * Returns undefined if the list is empty.
 * @param index
 * @returns {*}
 */
Denque.prototype.removeOne = function removeOne(index) {
  var this$1 = this;

  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  if (this._head === this._tail) { return void 0; }
  var size = this.size();
  var len = this._list.length;
  if (i >= size || i < -size) { return void 0; }
  if (i < 0) { i += size; }
  i = (this._head + i) & this._capacityMask;
  var item = this._list[i];
  var k;
  if (index < size / 2) {
    for (k = index; k > 0; k--) {
      this$1._list[i] = this$1._list[i = (i - 1 + len) & this$1._capacityMask];
    }
    this._list[i] = void 0;
    this._head = (this._head + 1 + len) & this._capacityMask;
  } else {
    for (k = size - 1 - index; k > 0; k--) {
      this$1._list[i] = this$1._list[i = ( i + 1 + len) & this$1._capacityMask];
    }
    this._list[i] = void 0;
    this._tail = (this._tail - 1 + len) & this._capacityMask;
  }
  return item;
};

/**
 * Remove number of items from the specified index from the list.
 * Returns array of removed items.
 * Returns undefined if the list is empty.
 * @param index
 * @param count
 * @returns {array}
 */
Denque.prototype.remove = function remove(index, count) {
  var this$1 = this;

  var i = index;
  var removed;
  var del_count = count;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  if (this._head === this._tail) { return void 0; }
  var size = this.size();
  var len = this._list.length;
  if (i >= size || i < -size || count < 1) { return void 0; }
  if (i < 0) { i += size; }
  if (count === 1 || !count) {
    removed = new Array(1);
    removed[0] = this.removeOne(i);
    return removed;
  }
  if (i === 0 && i + count >= size) { return this.clear(); }
  if (i + count > size) { count = size - i; }
  var k;
  removed = new Array(count);
  for (k = 0; k < count; k++) {
    removed[k] = this$1._list[(this$1._head + i + k) & this$1._capacityMask];
  }
  i = (this._head + i) & this._capacityMask;
  if (index + count === size) {
    this._tail = (this._tail - count + len) & this._capacityMask;
    for (k = count; k > 0; k--) {
      this$1._list[i = (i + 1 + len) & this$1._capacityMask] = void 0;
    }
    return removed;
  }
  if (index === 0) {
    this._head = (this._head + count + len) & this._capacityMask;
    for (k = count - 1; k > 0; k--) {
      this$1._list[i = (i + 1 + len) & this$1._capacityMask] = void 0;
    }
    return removed;
  }
  if (index < size / 2) {
    this._head = (this._head + index + count + len) & this._capacityMask;
    for (k = index; k > 0; k--) {
      this$1.unshift(this$1._list[i = (i - 1 + len) & this$1._capacityMask]);
    }
    i = (this._head - 1 + len) & this._capacityMask;
    while (del_count > 0) {
      this$1._list[i = (i - 1 + len) & this$1._capacityMask] = void 0;
      del_count--;
    }
  } else {
    this._tail = i;
    i = (i + count + len) & this._capacityMask;
    for (k = size - (count + index); k > 0; k--) {
      this$1.push(this$1._list[i++]);
    }
    i = this._tail;
    while (del_count > 0) {
      this$1._list[i = (i + 1 + len) & this$1._capacityMask] = void 0;
      del_count--;
    }
  }
  if (this._head < 2 && this._tail > 10000 && this._tail <= len >>> 2) { this._shrinkArray(); }
  return removed;
};

/**
 * Native splice implementation.
 * Remove number of items from the specified index from the list and/or add new elements.
 * Returns array of removed items or empty array if count == 0.
 * Returns undefined if the list is empty.
 *
 * @param index
 * @param count
 * @param {...*} [elements]
 * @returns {array}
 */
Denque.prototype.splice = function splice(index, count) {
  var arguments$1 = arguments;
  var this$1 = this;

  var i = index;
  var size = this.size();
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  if (this._head === this._tail) { return void 0; }
  if (i > size || i < -size) { return void 0; }
  if (i === size && count != 0) { return void 0; }
  if (i < 0) { i += size; }
  if (arguments.length > 2) {
    var k;
    var temp;
    var removed;
    var arg_len = arguments.length;
    var len = this._list.length;
    var arguments_index = 2;
    if (i < size / 2) {
      temp = new Array(i);
      for (k = 0; k < i; k++) {
        temp[k] = this$1._list[(this$1._head + k) & this$1._capacityMask];
      }
      if (count === 0) {
        removed = [];
        if (i > 0) {
          this._head = (this._head + i + len) & this._capacityMask;
        }
      } else {
        removed = this.remove(i, count);
        this._head = (this._head + i + len) & this._capacityMask;
      }
      while (arg_len > arguments_index) {
        this$1.unshift(arguments$1[--arg_len]);
      }
      for (k = i; k > 0; k--) {
        this$1.unshift(temp[k - 1]);
      }
    } else {
      temp = new Array(size - (i + count));
      var leng = temp.length;
      for (k = 0; k < leng; k++) {
        temp[k] = this$1._list[(this$1._head + i + count + k) & this$1._capacityMask];
      }
      if (count === 0) {
        removed = [];
        if (i != size) {
          this._tail = (this._head + i + len) & this._capacityMask;
        }
      } else {
        removed = this.remove(i, count);
        this._tail = (this._tail - leng + len) & this._capacityMask;
      }
      while (arguments_index < arg_len) {
        this$1.push(arguments$1[arguments_index++]);
      }
      for (k = 0; k < leng; k++) {
        this$1.push(temp[k]);
      }
    }
    return removed;
  } else {
    return this.remove(i, count);
  }
};

/**
 * Soft clear - does not reset capacity.
 */
Denque.prototype.clear = function clear() {
  this._head = 0;
  this._tail = 0;
};

/**
 * Returns true or false whether the list is empty.
 * @returns {boolean}
 */
Denque.prototype.isEmpty = function isEmpty() {
  return this._head === this._tail;
};

/**
 * Returns an array of all queue items.
 * @returns {Array}
 */
Denque.prototype.toArray = function toArray() {
  return this._copyArray(false);
};

/**
 * -------------
 *   INTERNALS
 * -------------
 */

/**
 * Fills the queue with items from an array
 * For use in the constructor
 * @param array
 * @private
 */
Denque.prototype._fromArray = function _fromArray(array) {
  var this$1 = this;

  for (var i = 0; i < array.length; i++) { this$1.push(array[i]); }
};

/**
 *
 * @param fullCopy
 * @returns {Array}
 * @private
 */
Denque.prototype._copyArray = function _copyArray(fullCopy) {
  var newArray = [];
  var list = this._list;
  var len = list.length;
  var i;
  if (fullCopy || this._head > this._tail) {
    for (i = this._head; i < len; i++) { newArray.push(list[i]); }
    for (i = 0; i < this._tail; i++) { newArray.push(list[i]); }
  } else {
    for (i = this._head; i < this._tail; i++) { newArray.push(list[i]); }
  }
  return newArray;
};

/**
 * Grows the internal list array.
 * @private
 */
Denque.prototype._growArray = function _growArray() {
  if (this._head) {
    // copy existing data, head to end, then beginning to tail.
    this._list = this._copyArray(true);
    this._head = 0;
  }

  // head is at 0 and array is now full, safe to extend
  this._tail = this._list.length;

  this._list.length *= 2;
  this._capacityMask = (this._capacityMask << 1) | 1;
};

/**
 * Shrinks the internal list array.
 * @private
 */
Denque.prototype._shrinkArray = function _shrinkArray() {
  this._list.length >>>= 1;
  this._capacityMask >>>= 1;
};


var index$6 = Denque;

/*eslint no-cond-assign:0, no-constant-condition:0 */

function interpreter(rej, res){

  //This is the primary queue of actions. All actions in here will be "cold",
  //meaning they haven't had the chance yet to run concurrent computations.
  var cold = new index$6(this._actions.size);

  //This is the secondary queue of actions. All actions in here will be "hot",
  //meaning they have already had a chance to run a concurrent computation.
  var queue = new index$6(this._actions.size);

  //These combined variables define our current state.
  // future  = the future we are currently forking
  // action  = the action to be informed when the future settles
  // cancel  = the cancel function of the current future
  // settled = a boolean indicating whether a new tick should start
  // async   = a boolean indicating whether we are awaiting a result asynchronously
  var future, action, cancel = noop, settled, async = true, it;

  //This function is called with a future to use in the next tick.
  //Here we "flatten" the actions of another Sequence into our own actions,
  //this is the magic that allows for infinitely stack safe recursion because
  //actions like ChainAction will return a new Sequence.
  //If we settled asynchronously, we call drain() directly to run the next tick.
  function settle(m){
    settled = true;
    future = m;

    if(future._spawn){
      var tail = future._actions;

      while(!tail.isEmpty){
        cold.unshift(tail.head);
        tail = tail.tail;
      }

      future = future._spawn;
    }

    if(async) { drain(); }
  }

  //This function serves as a rejection handler for our current future.
  //It will tell the current action that the future rejected, and it will
  //settle the current tick with the action's answer to that.
  function rejected(x){
    settle(action.rejected(x));
  }

  //This function serves as a resolution handler for our current future.
  //It will tell the current action that the future resolved, and it will
  //settle the current tick with the action's answer to that.
  function resolved(x){
    settle(action.resolved(x));
  }

  //This function is passed into actions when they are "warmed up".
  //If the action decides that it has its result, without the need to await
  //anything else, then it can call this function to force "early termination".
  //When early termination occurs, all actions which were queued prior to the
  //terminator will be skipped. If they were already hot, they will also receive
  //a cancel signal so they can cancel their own concurrent computations, as
  //their results are no longer needed.
  function early(m, terminator){
    cancel();
    cold.clear();

    if(async && action !== terminator){
      action.cancel();
      while((it = queue.shift()) && it !== terminator) { it.cancel(); }
    }

    settle(m);
  }

  //This function serves to kickstart concurrent computations.
  //Takes all actions from the cold queue *back-to-front*, and calls run() on
  //each of them, passing them the "early" function. If any of them settles (by
  //calling early()), we abort. After warming up all actions in the cold queue,
  //we warm up the current action as well.
  function warmupActions(){
    while(it = cold.pop()){
      it = it.run(early);
      if(settled) { return; }
      queue.unshift(it);
    }

    action = action.run(early);
  }

  //This function represents our main execution loop.
  //When we refer to a "tick", we mean the execution of the body inside the
  //primary while-loop of this function.
  //Every tick follows the following algorithm:
  // 1. We try to take an action from the cold queue, if we fail, go to step 2.
  //      1a. We fork the future.
  //      1b. We warmupActions() if the we haven't settled yet.
  // 2. We try to take an action from the hot queue, if we fail, go to step 3.
  //      2a. We fork the Future, if settles, we continue to the next tick.
  // 3. If we couldn't take actions from either queues, we fork the Future into
  //    the user provided continuations. This is the end of the interpretation.
  // 4. If we did take an action from one of queues, but none of the steps
  //    caused a settle(), it means we are asynchronously waiting for something
  //    to settle and start the next tick, so we return from the function.
  function drain(){
    async = false;

    while(true){
      settled = false;
      if(action = cold.shift()){
        cancel = future._fork(rejected, resolved);
        if(!settled) { warmupActions(); }
      }else if(action = queue.shift()){
        cancel = future._fork(rejected, resolved);
      }else { break; }
      if(settled) { continue; }
      async = true;
      return;
    }

    cancel = future._fork(rej, res);
  }

  //Start the execution loop.
  settle(this);

  //Return a cancellation function. It will cancel the current Future, the
  //current action, and all queued hot actions.
  return function Sequence$cancel(){
    cancel();
    action && action.cancel();
    while(it = queue.shift()) { it.cancel(); }
  };

}

var empty = ({isEmpty: true, size: 0, head: null, tail: null});
var cons = function (head, tail) { return ({isEmpty: false, size: tail.size + 1, head: head, tail: tail}); };

var throwRejection = function (x) { return error(
  ("Future#value was called on a rejected Future\n  Actual: Future.reject(" + (show(x)) + ")")
); };

function Future$1(computation){
  if(!isFunction(computation)) { invalidArgument('Future', 0, 'be a Function', computation); }
  return new Computation(computation);
}

function isFuture(x){
  return x instanceof Future$1 || index$5(x) === $$type;
}

Future$1.prototype.ap = function Future$ap(other){
  if(!isFuture(this)) { invalidContext('Future#ap', this); }
  if(!isFuture(other)) { invalidFuture('Future#ap', 0, other); }
  return this._ap(other);
};

Future$1.prototype.map = function Future$map(mapper){
  if(!isFuture(this)) { invalidContext('Future#map', this); }
  if(!isFunction(mapper)) { invalidArgument('Future#map', 0, 'to be a Function', mapper); }
  return this._map(mapper);
};

Future$1.prototype.bimap = function Future$bimap(lmapper, rmapper){
  if(!isFuture(this)) { invalidContext('Future#bimap', this); }
  if(!isFunction(lmapper)) { invalidArgument('Future#bimap', 0, 'to be a Function', lmapper); }
  if(!isFunction(rmapper)) { invalidArgument('Future#bimap', 1, 'to be a Function', rmapper); }
  return this._bimap(lmapper, rmapper);
};

Future$1.prototype.chain = function Future$chain(mapper){
  if(!isFuture(this)) { invalidContext('Future#chain', this); }
  if(!isFunction(mapper)) { invalidArgument('Future#chain', 0, 'to be a Function', mapper); }
  return this._chain(mapper);
};

Future$1.prototype.mapRej = function Future$mapRej(mapper){
  if(!isFuture(this)) { invalidContext('Future#mapRej', this); }
  if(!isFunction(mapper)) { invalidArgument('Future#mapRej', 0, 'to be a Function', mapper); }
  return this._mapRej(mapper);
};

Future$1.prototype.chainRej = function Future$chainRej(mapper){
  if(!isFuture(this)) { invalidContext('Future#chainRej', this); }
  if(!isFunction(mapper)) { invalidArgument('Future#chainRej', 0, 'to be a Function', mapper); }
  return this._chainRej(mapper);
};

Future$1.prototype.race = function Future$race(other){
  if(!isFuture(this)) { invalidContext('Future#race', this); }
  if(!isFuture(other)) { invalidFuture('Future#race', 0, other); }
  return this._race(other);
};

Future$1.prototype.both = function Future$both(other){
  if(!isFuture(this)) { invalidContext('Future#both', this); }
  if(!isFuture(other)) { invalidFuture('Future#both', 0, other); }
  return this._both(other);
};

Future$1.prototype.and = function Future$and(other){
  if(!isFuture(this)) { invalidContext('Future#and', this); }
  if(!isFuture(other)) { invalidFuture('Future#and', 0, other); }
  return this._and(other);
};

Future$1.prototype.or = function Future$or(other){
  if(!isFuture(this)) { invalidContext('Future#or', this); }
  if(!isFuture(other)) { invalidFuture('Future#or', 0, other); }
  return this._or(other);
};

Future$1.prototype.swap = function Future$swap(){
  if(!isFuture(this)) { invalidContext('Future#ap', this); }
  return this._swap();
};

Future$1.prototype.fold = function Future$fold(lmapper, rmapper){
  if(!isFuture(this)) { invalidContext('Future#ap', this); }
  if(!isFunction(lmapper)) { invalidArgument('Future#fold', 0, 'to be a Function', lmapper); }
  if(!isFunction(rmapper)) { invalidArgument('Future#fold', 1, 'to be a Function', rmapper); }
  return this._fold(lmapper, rmapper);
};

Future$1.prototype.finally = function Future$finally(other){
  if(!isFuture(this)) { invalidContext('Future#finally', this); }
  if(!isFuture(other)) { invalidFuture('Future#finally', 0, other); }
  return this._finally(other);
};

Future$1.prototype.lastly = function Future$lastly(other){
  if(!isFuture(this)) { invalidContext('Future#lastly', this); }
  if(!isFuture(other)) { invalidFuture('Future#lastly', 0, other); }
  return this._finally(other);
};

Future$1.prototype.fork = function Future$fork(rej, res){
  if(!isFuture(this)) { invalidContext('Future#fork', this); }
  if(!isFunction(rej)) { invalidArgument('Future#fork', 0, 'to be a Function', rej); }
  if(!isFunction(res)) { invalidArgument('Future#fork', 0, 'to be a Function', res); }
  return this._fork(rej, res);
};

Future$1.prototype.value = function Future$value(res){
  if(!isFuture(this)) { invalidContext('Future#value', this); }
  if(!isFunction(res)) { invalidArgument('Future#value', 0, 'to be a Function', res); }
  return this._fork(throwRejection, res);
};

Future$1.prototype.done = function Future$done(callback){
  if(!isFuture(this)) { invalidContext('Future#done', this); }
  if(!isFunction(callback)) { invalidArgument('Future#done', 0, 'to be a Function', callback); }
  return this._fork(function Future$done$rej(x){ callback(x); },
                    function Future$done$res(x){ callback(null, x); });
};

Future$1.prototype.promise = function Future$promise(){
  var this$1 = this;

  return new Promise(function (res, rej) { return this$1._fork(rej, res); });
};

Future$1.prototype.isRejected = function Future$isRejected(){
  return false;
};

Future$1.prototype.isResolved = function Future$isResolved(){
  return false;
};

Future$1.prototype.isSettled = function Future$isSettled(){
  return this.isRejected() || this.isResolved();
};

Future$1.prototype.extractLeft = function Future$extractLeft(){
  return [];
};

Future$1.prototype.extractRight = function Future$extractRight(){
  return [];
};

var Core = Object.create(Future$1.prototype);

Core._ap = function Core$ap(other){
  return new Sequence(this)._ap(other);
};

Core._map = function Core$map(mapper){
  return new Sequence(this)._map(mapper);
};

Core._bimap = function Core$bimap(lmapper, rmapper){
  return new Sequence(this)._bimap(lmapper, rmapper);
};

Core._chain = function Core$chain(mapper){
  return new Sequence(this)._chain(mapper);
};

Core._mapRej = function Core$mapRej(mapper){
  return new Sequence(this)._mapRej(mapper);
};

Core._chainRej = function Core$chainRej(mapper){
  return new Sequence(this)._chainRej(mapper);
};

Core._race = function Core$race(other){
  return new Sequence(this)._race(other);
};

Core._both = function Core$both(other){
  return new Sequence(this)._both(other);
};

Core._and = function Core$and(other){
  return new Sequence(this)._and(other);
};

Core._or = function Core$or(other){
  return new Sequence(this)._or(other);
};

Core._swap = function Core$swap(){
  return new Sequence(this)._swap();
};

Core._fold = function Core$fold(lmapper, rmapper){
  return new Sequence(this)._fold(lmapper, rmapper);
};

Core._finally = function Core$finally(other){
  return new Sequence(this)._finally(other);
};

function check$fork(f, c){
  if(!(f === undefined || (isFunction(f) && f.length === 0))) { typeError(
    'Future expected its computation to return a nullary function or void'
    + "\n  Actual: " + (show(f)) + "\n  From calling: " + (showf(c))
  ); }
}

function Computation(computation){
  this._computation = computation;
}

Computation.prototype = Object.create(Core);

Computation.prototype._fork = function Computation$_fork(rej, res){
  var open = true;
  var f = this._computation(function Computation$rej(x){
    if(open){
      open = false;
      rej(x);
    }
  }, function Computation$res(x){
    if(open){
      open = false;
      res(x);
    }
  });
  check$fork(f, this._computation);

  return function Computation$cancel(){
    open && f && f();
    open = false;
  };
};

Computation.prototype.toString = function Computation$toString(){
  return ("Future(" + (showf(this._computation)) + ")");
};

function Rejected(value){
  this._value = value;
}

Rejected.prototype = Object.create(Core);

Rejected.prototype._ap = moop;
Rejected.prototype._map = moop;
Rejected.prototype._chain = moop;
Rejected.prototype._race = moop;
Rejected.prototype._both = moop;
Rejected.prototype._and = moop;

Rejected.prototype._or = function Rejected$or(other){
  return other;
};

Rejected.prototype._finally = function Rejected$finally(other){
  return other._and(this);
};

Rejected.prototype._swap = function Rejected$swap(){
  return new Resolved(this._value);
};

Rejected.prototype._fork = function Rejected$_fork(rej){
  rej(this._value);
  return noop;
};

Rejected.prototype.isRejected = function Rejected$isRejected(){
  return true;
};

Rejected.prototype.extractLeft = function Rejected$extractLeft(){
  return [this._value];
};

Rejected.prototype.toString = function Rejected$toString(){
  return ("Future.reject(" + (show(this._value)) + ")");
};

var reject = function (x) { return new Rejected(x); };

function Resolved(value){
  this._value = value;
}

Resolved.prototype = Object.create(Core);

Resolved.prototype._race = moop;
Resolved.prototype._mapRej = moop;
Resolved.prototype._or = moop;

Resolved.prototype._and = function Resolved$and(other){
  return other;
};

Resolved.prototype._both = function Resolved$both(other){
  var this$1 = this;

  return other._map(function (x) { return [this$1._value, x]; });
};

Resolved.prototype._swap = function Resolved$swap(){
  return new Rejected(this._value);
};

Resolved.prototype._finally = function Resolved$finally(other){
  var this$1 = this;

  return other._map(function () { return this$1._value; });
};

Resolved.prototype._fork = function _fork(rej, res){
  res(this._value);
  return noop;
};

Resolved.prototype.isResolved = function Resolved$isResolved(){
  return true;
};

Resolved.prototype.extractRight = function Resolved$extractRight(){
  return [this._value];
};

Resolved.prototype.toString = function Resolved$toString(){
  return ("Future.of(" + (show(this._value)) + ")");
};

var of = function (x) { return new Resolved(x); };

function Never(){
  this._isNever = true;
}

Never.prototype = Object.create(Future$1.prototype);

Never.prototype._ap = moop;
Never.prototype._map = moop;
Never.prototype._bimap = moop;
Never.prototype._chain = moop;
Never.prototype._mapRej = moop;
Never.prototype._chainRej = moop;
Never.prototype._both = moop;
Never.prototype._or = moop;
Never.prototype._swap = moop;
Never.prototype._fold = moop;
Never.prototype._finally = moop;

Never.prototype._race = function Never$race(other){
  return other;
};

Never.prototype._fork = function Never$_fork(){
  return noop;
};

Never.prototype.toString = function Never$toString(){
  return 'Future.never';
};

var never = new Never();
var isNever = function (x) { return isFuture(x) && x._isNever === true; };

function Eager(future){
  var this$1 = this;

  this.rej = noop;
  this.res = noop;
  this.rejected = false;
  this.resolved = false;
  this.value = null;
  this.cancel = future._fork(function (x) {
    this$1.value = x;
    this$1.rejected = true;
    this$1.cancel = noop;
    this$1.rej(x);
  }, function (x) {
    this$1.value = x;
    this$1.resolved = true;
    this$1.cancel = noop;
    this$1.res(x);
  });
}

Eager.prototype = Object.create(Core);

Eager.prototype._fork = function Eager$_fork(rej, res){
  if(this.rejected) { rej(this.value); }
  else if(this.resolved) { res(this.value); }
  else{
    this.rej = rej;
    this.res = res;
  }

  return this.cancel;
};

var Action = function Action () {};

Action.prototype.rejected = function rejected (x){ this.cancel(); return new Rejected(x) };
Action.prototype.resolved = function resolved (x){ this.cancel(); return new Resolved(x) };
Action.prototype.run = function run (){ return this };
Action.prototype.cancel = function cancel (){};
var check$ap = function (f) { return isFunction(f) ? f : typeError(
  'Future#ap expects its first argument to be a Future of a Function'
  + "\n  Actual: Future.of(" + (show(f)) + ")"
); };
var ApAction = (function (Action) {
  function ApAction(other){ Action.call(this); this.other = other; }

  if ( Action ) ApAction.__proto__ = Action;
  ApAction.prototype = Object.create( Action && Action.prototype );
  ApAction.prototype.constructor = ApAction;
  ApAction.prototype.resolved = function resolved (f){ check$ap(f); return this.other._map(function (x) { return f(x); }) };
  ApAction.prototype.toString = function toString (){ return ("ap(" + (this.other.toString()) + ")") };

  return ApAction;
}(Action));
var MapAction = (function (Action) {
  function MapAction(mapper){ Action.call(this); this.mapper = mapper; }

  if ( Action ) MapAction.__proto__ = Action;
  MapAction.prototype = Object.create( Action && Action.prototype );
  MapAction.prototype.constructor = MapAction;
  MapAction.prototype.resolved = function resolved (x){ return new Resolved(this.mapper(x)) };
  MapAction.prototype.toString = function toString (){ return ("map(" + (showf(this.mapper)) + ")") };

  return MapAction;
}(Action));
var BimapAction = (function (Action) {
  function BimapAction(lmapper, rmapper){ Action.call(this); this.lmapper = lmapper; this.rmapper = rmapper; }

  if ( Action ) BimapAction.__proto__ = Action;
  BimapAction.prototype = Object.create( Action && Action.prototype );
  BimapAction.prototype.constructor = BimapAction;
  BimapAction.prototype.rejected = function rejected (x){ return new Rejected(this.lmapper(x)) };
  BimapAction.prototype.resolved = function resolved (x){ return new Resolved(this.rmapper(x)) };
  BimapAction.prototype.toString = function toString (){ return ("bimap(" + (showf(this.lmapper)) + ", " + (showf(this.rmapper)) + ")") };

  return BimapAction;
}(Action));
var check$chain = function (m, f, x) { return isFuture(m) ? m : invalidFuture(
  'Future#chain',
  'the function it\'s given to return a Future',
  m,
  ("\n  From calling: " + (showf(f)) + "\n  With: " + (show(x)))
); };
var ChainAction = (function (Action) {
  function ChainAction(mapper){ Action.call(this); this.mapper = mapper; }

  if ( Action ) ChainAction.__proto__ = Action;
  ChainAction.prototype = Object.create( Action && Action.prototype );
  ChainAction.prototype.constructor = ChainAction;
  ChainAction.prototype.resolved = function resolved (x){ return check$chain(this.mapper(x), this.mapper, x) };
  ChainAction.prototype.toString = function toString (){ return ("chain(" + (showf(this.mapper)) + ")") };

  return ChainAction;
}(Action));
var MapRejAction = (function (Action) {
  function MapRejAction(mapper){ Action.call(this); this.mapper = mapper; }

  if ( Action ) MapRejAction.__proto__ = Action;
  MapRejAction.prototype = Object.create( Action && Action.prototype );
  MapRejAction.prototype.constructor = MapRejAction;
  MapRejAction.prototype.rejected = function rejected (x){ return new Rejected(this.mapper(x)) };
  MapRejAction.prototype.toString = function toString (){ return ("mapRej(" + (showf(this.mapper)) + ")") };

  return MapRejAction;
}(Action));
var check$chainRej = function (m, f, x) { return isFuture(m) ? m : invalidFuture(
  'Future#chainRej',
  'the function it\'s given to return a Future',
  m,
  ("\n  From calling: " + (showf(f)) + "\n  With: " + (show(x)))
); };
var ChainRejAction = (function (Action) {
  function ChainRejAction(mapper){ Action.call(this); this.mapper = mapper; }

  if ( Action ) ChainRejAction.__proto__ = Action;
  ChainRejAction.prototype = Object.create( Action && Action.prototype );
  ChainRejAction.prototype.constructor = ChainRejAction;
  ChainRejAction.prototype.rejected = function rejected (x){ return check$chainRej(this.mapper(x), this.mapper, x) };
  ChainRejAction.prototype.toString = function toString (){ return ("chainRej(" + (showf(this.mapper)) + ")") };

  return ChainRejAction;
}(Action));
var SwapAction = (function (Action) {
  function SwapAction(){ Action.call(this); return SwapAction.instance || (SwapAction.instance = this) }

  if ( Action ) SwapAction.__proto__ = Action;
  SwapAction.prototype = Object.create( Action && Action.prototype );
  SwapAction.prototype.constructor = SwapAction;
  SwapAction.prototype.rejected = function rejected (x){ return new Resolved(x) };
  SwapAction.prototype.resolved = function resolved (x){ return new Rejected(x) };
  SwapAction.prototype.toString = function toString (){ return 'swap()' };

  return SwapAction;
}(Action));
var FoldAction = (function (Action) {
  function FoldAction(lmapper, rmapper){ Action.call(this); this.lmapper = lmapper; this.rmapper = rmapper; }

  if ( Action ) FoldAction.__proto__ = Action;
  FoldAction.prototype = Object.create( Action && Action.prototype );
  FoldAction.prototype.constructor = FoldAction;
  FoldAction.prototype.rejected = function rejected (x){ return new Resolved(this.lmapper(x)) };
  FoldAction.prototype.resolved = function resolved (x){ return new Resolved(this.rmapper(x)) };
  FoldAction.prototype.toString = function toString (){ return ("fold(" + (showf(this.lmapper)) + ", " + (showf(this.rmapper)) + ")") };

  return FoldAction;
}(Action));
var FinallyAction = (function (Action) {
  function FinallyAction(other){ Action.call(this); this.other = other; }

  if ( Action ) FinallyAction.__proto__ = Action;
  FinallyAction.prototype = Object.create( Action && Action.prototype );
  FinallyAction.prototype.constructor = FinallyAction;
  FinallyAction.prototype.cancel = function cancel (){ this.other._fork(noop, noop)(); };
  FinallyAction.prototype.rejected = function rejected (x){ return this.other._and(new Rejected(x)) };
  FinallyAction.prototype.resolved = function resolved (x){ return this.other._map(function () { return x; }) };
  FinallyAction.prototype.toString = function toString (){ return ("finally(" + (this.other.toString()) + ")") };

  return FinallyAction;
}(Action));
var AndAction = (function (Action) {
  function AndAction(other){ Action.call(this); this.other = other; }

  if ( Action ) AndAction.__proto__ = Action;
  AndAction.prototype = Object.create( Action && Action.prototype );
  AndAction.prototype.constructor = AndAction;
  AndAction.prototype.resolved = function resolved (){ return this.other };
  AndAction.prototype.toString = function toString (){ return ("and(" + (this.other.toString()) + ")") };

  return AndAction;
}(Action));
var OrAction = (function (Action) {
  function OrAction(other){ Action.call(this); this.other = other; }

  if ( Action ) OrAction.__proto__ = Action;
  OrAction.prototype = Object.create( Action && Action.prototype );
  OrAction.prototype.constructor = OrAction;
  OrAction.prototype.rejected = function rejected (){ return this.other };
  OrAction.prototype.toString = function toString (){ return ("or(" + (this.other.toString()) + ")") };

  return OrAction;
}(Action));
var RaceAction = (function (Action) {
  function RaceAction(other){ Action.call(this); this.other = other; }

  if ( Action ) RaceAction.__proto__ = Action;
  RaceAction.prototype = Object.create( Action && Action.prototype );
  RaceAction.prototype.constructor = RaceAction;
  RaceAction.prototype.run = function run (early){ return new RaceActionState(early, new Eager(this.other)) };
  RaceAction.prototype.toString = function toString (){ return ("race(" + (this.other.toString()) + ")") };

  return RaceAction;
}(Action));
var RaceActionState = (function (RaceAction) {
  function RaceActionState(early, other){
    var this$1 = this;

    RaceAction.call(this, other);
    this.cancel = other._fork(function (x) { return early(new Rejected(x), this$1); }, function (x) { return early(new Resolved(x), this$1); });
  }

  if ( RaceAction ) RaceActionState.__proto__ = RaceAction;
  RaceActionState.prototype = Object.create( RaceAction && RaceAction.prototype );
  RaceActionState.prototype.constructor = RaceActionState;

  return RaceActionState;
}(RaceAction));
var BothAction = (function (Action) {
  function BothAction(other){ Action.call(this); this.other = other; }

  if ( Action ) BothAction.__proto__ = Action;
  BothAction.prototype = Object.create( Action && Action.prototype );
  BothAction.prototype.constructor = BothAction;
  BothAction.prototype.run = function run (early){ return new BothActionState(early, new Eager(this.other)) };
  BothAction.prototype.resolved = function resolved (x){ return this.other._map(function (y) { return [x, y]; }) };
  BothAction.prototype.toString = function toString (){ return ("both(" + (this.other.toString()) + ")") };

  return BothAction;
}(Action));
var BothActionState = (function (BothAction) {
  function BothActionState(early, other){
    var this$1 = this;

    BothAction.call(this, other);
    this.cancel = this.other.fork(function (x) { return early(new Rejected(x), this$1); }, noop);
  }

  if ( BothAction ) BothActionState.__proto__ = BothAction;
  BothActionState.prototype = Object.create( BothAction && BothAction.prototype );
  BothActionState.prototype.constructor = BothActionState;

  return BothActionState;
}(BothAction));

function Sequence(spawn, actions){
  if ( actions === void 0 ) actions = empty;

  this._spawn = spawn;
  this._actions = actions;
}

Sequence.prototype = Object.create(Future$1.prototype);

Sequence.prototype._transform = function Sequence$_transform(action){
  return new Sequence(this._spawn, cons(action, this._actions));
};

Sequence.prototype._ap = function Sequence$ap(other){
  return this._transform(new ApAction(other));
};

Sequence.prototype._map = function Sequence$map(mapper){
  return this._transform(new MapAction(mapper));
};

Sequence.prototype._bimap = function Sequence$bimap(lmapper, rmapper){
  return this._transform(new BimapAction(lmapper, rmapper));
};

Sequence.prototype._chain = function Sequence$chain(mapper){
  return this._transform(new ChainAction(mapper));
};

Sequence.prototype._mapRej = function Sequence$mapRej(mapper){
  return this._transform(new MapRejAction(mapper));
};

Sequence.prototype._chainRej = function Sequence$chainRej(mapper){
  return this._transform(new ChainRejAction(mapper));
};

Sequence.prototype._race = function Sequence$race(other){
  return isNever(other) ? this : this._transform(new RaceAction(other));
};

Sequence.prototype._both = function Sequence$both(other){
  return this._transform(new BothAction(other));
};

Sequence.prototype._and = function Sequence$and(other){
  return this._transform(new AndAction(other));
};

Sequence.prototype._or = function Sequence$or(other){
  return this._transform(new OrAction(other));
};

Sequence.prototype._swap = function Sequence$swap(){
  return this._transform(new SwapAction);
};

Sequence.prototype._fold = function Sequence$fold(lmapper, rmapper){
  return this._transform(new FoldAction(lmapper, rmapper));
};

Sequence.prototype._finally = function Sequence$finally(other){
  return this._transform(new FinallyAction(other));
};

Sequence.prototype._fork = interpreter;

Sequence.prototype.toString = function Sequence$toString(){
  var str = '', tail = this._actions;

  while(!tail.isEmpty){
    str = "." + (tail.head.toString()) + str;
    tail = tail.tail;
  }

  return ("" + (this._spawn.toString()) + str);
};

var Next = function (x) { return ({done: false, value: x}); };
var Done = function (x) { return ({done: true, value: x}); };
var isIteration = function (x) { return isObject(x) && isBoolean(x.done); };

var Undetermined = 0;
var Synchronous = 1;
var Asynchronous = 2;

function ChainRec(step, init){
  this._step = step;
  this._init = init;
}

ChainRec.prototype = Object.create(Core);

ChainRec.prototype._fork = function ChainRec$_fork(rej, res){

  var ref = this;
  var _step = ref._step;
  var _init = ref._init;
  var timing = Undetermined, cancel = noop, state = Next(_init);

  function resolved(it){
    state = it;
    timing = timing === Undetermined ? Synchronous : drain();
  }

  function drain(){
    while(!state.done){
      timing = Undetermined;
      var m = _step(Next, Done, state.value);
      cancel = m._fork(rej, resolved);

      if(timing !== Synchronous){
        timing = Asynchronous;
        return;
      }
    }

    res(state.value);
  }

  drain();

  return function Future$chainRec$cancel(){ cancel(); };

};

ChainRec.prototype.toString = function ChainRec$toString(){
  return ("Future.chainRec(" + (showf(this._step)) + ", " + (show(this._init)) + ")");
};

function chainRec(step, init){
  return new ChainRec(step, init);
}

function ap$mval(mval, mfunc){
  if(!index$2.Apply.test(mfunc)) { invalidArgument('Future.ap', 1, 'be an Apply', mfunc); }
  return index$2.ap(mval, mfunc);
}

function ap(mval, mfunc){
  if(!index$2.Apply.test(mval)) { invalidArgument('Future.ap', 0, 'be an Apply', mval); }
  if(arguments.length === 1) { return partial1(ap$mval, mval); }
  return ap$mval(mval, mfunc);
}

function alt$left(left, right){
  if(!index$2.Alt.test(right)) { invalidArgument('alt', 1, 'be an Alt', right); }
  return index$2.alt(left, right);
}

function alt(left, right){
  if(!index$2.Alt.test(left)) { invalidArgument('alt', 0, 'be an Alt', left); }
  if(arguments.length === 1) { return partial1(alt$left, left); }
  return alt$left(left, right);
}

function map$mapper(mapper, m){
  if(!index$2.Functor.test(m)) { invalidArgument('Future.map', 1, 'be a Functor', m); }
  return index$2.map(mapper, m);
}

function map(mapper, m){
  if(!isFunction(mapper)) { invalidArgument('Future.map', 0, 'be a Function', mapper); }
  if(arguments.length === 1) { return partial1(map$mapper, mapper); }
  return map$mapper(mapper, m);
}

function bimap$lmapper$rmapper(lmapper, rmapper, m){
  if(!index$2.Bifunctor.test(m)) { invalidArgument('Future.bimap', 2, 'be a Bifunctor', m); }
  return index$2.bimap(lmapper, rmapper, m);
}

function bimap$lmapper(lmapper, rmapper, m){
  if(!isFunction(rmapper)) { invalidArgument('Future.bimap', 1, 'be a Function', rmapper); }
  if(arguments.length === 2) { return partial2(bimap$lmapper$rmapper, lmapper, rmapper); }
  return bimap$lmapper$rmapper(lmapper, rmapper, m);
}

function bimap(lmapper, rmapper, m){
  if(!isFunction(lmapper)) { invalidArgument('Future.bimap', 0, 'be a Function', lmapper); }
  if(arguments.length === 1) { return partial1(bimap$lmapper, lmapper); }
  if(arguments.length === 2) { return bimap$lmapper(lmapper, rmapper); }
  return bimap$lmapper(lmapper, rmapper, m);
}

function chain$chainer(chainer, m){
  if(!index$2.Chain.test(m)) { invalidArgument('Future.chain', 1, 'be a Chain', m); }
  return index$2.chain(chainer, m);
}

function chain(chainer, m){
  if(!isFunction(chainer)) { invalidArgument('Future.chain', 0, 'be a Function', chainer); }
  if(arguments.length === 1) { return partial1(chain$chainer, chainer); }
  return chain$chainer(chainer, m);
}

function mapRej$mapper(mapper, m){
  if(!isFuture(m)) { invalidFuture('Future.mapRej', 1, m); }
  return m.mapRej(mapper);
}

function mapRej(mapper, m){
  if(!isFunction(mapper)) { invalidArgument('Future.mapRej', 0, 'be a Function', mapper); }
  if(arguments.length === 1) { return partial1(mapRej$mapper, mapper); }
  return mapRej$mapper(mapper, m);
}

function chainRej$chainer(chainer, m){
  if(!isFuture(m)) { invalidFuture('Future.chainRej', 1, m); }
  return m.chainRej(chainer);
}

function chainRej(chainer, m){
  if(!isFunction(chainer)) { invalidArgument('Future.chainRej', 0, 'be a Function', chainer); }
  if(arguments.length === 1) { return partial1(chainRej$chainer, chainer); }
  return chainRej$chainer(chainer, m);
}

function lastly$right(right, left){
  if(!isFuture(left)) { invalidFuture('Future.finally', 1, left); }
  return left.finally(right);
}

function lastly(right, left){
  if(!isFuture(right)) { invalidFuture('Future.finally', 0, right); }
  if(arguments.length === 1) { return partial1(lastly$right, right); }
  return lastly$right(right, left);
}

function and$left(left, right){
  if(!isFuture(right)) { invalidFuture('Future.and', 1, right); }
  return left.and(right);
}

function and(left, right){
  if(!isFuture(left)) { invalidFuture('Future.and', 0, left); }
  if(arguments.length === 1) { return partial1(and$left, left); }
  return and$left(left, right);
}

function both$left(left, right){
  if(!isFuture(right)) { invalidFuture('Future.both', 1, right); }
  return left.both(right);
}

function both(left, right){
  if(!isFuture(left)) { invalidFuture('Future.both', 0, left); }
  if(arguments.length === 1) { return partial1(both$left, left); }
  return both$left(left, right);
}

function or$left(left, right){
  if(!isFuture(right)) { invalidFuture('Future.or', 1, right); }
  return left.or(right);
}

function or(left, right){
  if(!isFuture(left)) { invalidFuture('Future.or', 0, left); }
  if(arguments.length === 1) { return partial1(or$left, left); }
  return or$left(left, right);
}

function race$right(right, left){
  if(!isFuture(left)) { invalidFuture('Future.race', 1, left); }
  return left.race(right);
}

function race(right, left){
  if(!isFuture(right)) { invalidFuture('Future.race', 0, right); }
  if(arguments.length === 1) { return partial1(race$right, right); }
  return race$right(right, left);
}

function swap(m){
  if(!isFuture(m)) { invalidFuture('Future.swap', 0, m); }
  return m.swap();
}

function fold$f$g(f, g, m){
  if(!isFuture(m)) { invalidFuture('Future.fold', 2, m); }
  return m.fold(f, g);
}

function fold$f(f, g, m){
  if(!isFunction(g)) { invalidArgument('Future.fold', 1, 'be a function', g); }
  if(arguments.length === 2) { return partial2(fold$f$g, f, g); }
  return fold$f$g(f, g, m);
}

function fold(f, g, m){
  if(!isFunction(f)) { invalidArgument('Future.fold', 0, 'be a function', f); }
  if(arguments.length === 1) { return partial1(fold$f, f); }
  if(arguments.length === 2) { return fold$f(f, g); }
  return fold$f(f, g, m);
}

function done$callback(callback, m){
  if(!isFuture(m)) { invalidFuture('Future.done', 1, m); }
  return m.done(callback);
}

function done(callback, m){
  if(!isFunction(callback)) { invalidArgument('Future.done', 0, 'be a Function', callback); }
  if(arguments.length === 1) { return partial1(done$callback, callback); }
  return done$callback(callback, m);
}

function fork$f$g(f, g, m){
  if(!isFuture(m)) { invalidFuture('Future.fork', 2, m); }
  return m._fork(f, g);
}

function fork$f(f, g, m){
  if(!isFunction(g)) { invalidArgument('Future.fork', 1, 'be a function', g); }
  if(arguments.length === 2) { return partial2(fork$f$g, f, g); }
  return fork$f$g(f, g, m);
}

function fork(f, g, m){
  if(!isFunction(f)) { invalidArgument('Future.fork', 0, 'be a function', f); }
  if(arguments.length === 1) { return partial1(fork$f, f); }
  if(arguments.length === 2) { return fork$f(f, g); }
  return fork$f(f, g, m);
}

function promise(m){
  if(!isFuture(m)) { invalidFuture('Future.promise', 0, m); }
  return m.promise();
}

function value$cont(cont, m){
  if(!isFuture(m)) { invalidFuture('Future.value', 1, m); }
  return m.value(cont);
}

function value(cont, m){
  if(!isFunction(cont)) { invalidArgument('Future.value', 0, 'be a Function', cont); }
  if(arguments.length === 1) { return partial1(value$cont, cont); }
  return value$cont(cont, m);
}

function extractLeft(m){
  if(!isFuture(m)) { invalidFuture('Future.extractLeft', 0, m); }
  return m.extractLeft();
}

function extractRight(m){
  if(!isFuture(m)) { invalidFuture('Future.extractRight', 0, m); }
  return m.extractRight();
}



var dispatchers = Object.freeze({
  ap: ap,
  alt: alt,
  map: map,
  bimap: bimap,
  chain: chain,
  mapRej: mapRej,
  chainRej: chainRej,
  lastly: lastly,
  finally: lastly,
  and: and,
  both: both,
  or: or,
  race: race,
  swap: swap,
  fold: fold,
  done: done,
  fork: fork,
  promise: promise,
  value: value,
  extractLeft: extractLeft,
  extractRight: extractRight
});

Future$1['@@type'] = $$type;
Future$1[FL.of] = Future$1.of = of;
Future$1[FL.chainRec] = Future$1.chainRec = chainRec;
Future$1.reject = reject;

Future$1.ap = ap;

Future$1.prototype[FL.ap] = function Future$FL$ap(other){
  return other._ap(this);
};

Future$1.map = map;

Future$1.prototype[FL.map] = function Future$FL$map(mapper){
  return this._map(mapper);
};

Future$1.bimap = bimap;

Future$1.prototype[FL.bimap] = function Future$FL$bimap(lmapper, rmapper){
  return this._bimap(lmapper, rmapper);
};

Future$1.chain = chain;

Future$1.prototype[FL.chain] = function Future$FL$chain(mapper){
  return this._chain(mapper);
};

function After$race(other){
  return other.isSettled()
       ? other
       : isNever(other)
       ? this
       : typeof other._time === 'number'
       ? other._time < this._time ? other : this
       : Core._race.call(this, other);
}

function After(time, value){
  this._time = time;
  this._value = value;
}

After.prototype = Object.create(Core);

After.prototype._race = After$race;

After.prototype._swap = function After$swap(){
  return new RejectAfter(this._time, this._value);
};

After.prototype._fork = function After$_fork(rej, res){
  var id = setTimeout(res, this._time, this._value);
  return function () { clearTimeout(id); };
};

After.prototype.extractRight = function After$extractRight(){
  return [this._value];
};

After.prototype.toString = function After$toString(){
  return ("Future.after(" + (show(this._time)) + ", " + (show(this._value)) + ")");
};

function RejectAfter(time, value){
  this._time = time;
  this._value = value;
}

RejectAfter.prototype = Object.create(Core);

RejectAfter.prototype._race = After$race;

RejectAfter.prototype._swap = function RejectAfter$swap(){
  return new After(this._time, this._value);
};

RejectAfter.prototype._fork = function RejectAfter$_fork(rej){
  var id = setTimeout(rej, this._time, this._value);
  return function () { clearTimeout(id); };
};

RejectAfter.prototype.extractLeft = function RejectAfter$extractLeft(){
  return [this._value];
};

RejectAfter.prototype.toString = function RejectAfter$toString(){
  return ("Future.rejectAfter(" + (show(this._time)) + ", " + (show(this._value)) + ")");
};

function after$time(time, value){
  return time === Infinity ? never : new After(time, value);
}

function after(time, value){
  if(!isUnsigned(time)) { invalidArgument('Future.after', 0, 'be a positive integer', time); }
  if(arguments.length === 1) { return partial1(after$time, time); }
  return after$time(time, value);
}

function rejectAfter$time(time, reason){
  return time === Infinity ? never : new RejectAfter(time, reason);
}

function rejectAfter(time, reason){
  if(!isUnsigned(time)) { invalidArgument('Future.rejectAfter', 0, 'be a positive integer', time); }
  if(arguments.length === 1) { return partial1(rejectAfter$time, time); }
  return rejectAfter$time(time, reason);
}

function Attempt(fn){
  this._fn = fn;
}

Attempt.prototype = Object.create(Core);

Attempt.prototype._fork = function Attempt$fork(rej, res){
  var r;
  try{ r = this._fn(); }catch(e){ rej(e); return noop }
  res(r);
  return noop;
};

Attempt.prototype.toString = function Attempt$toString(){
  return ("Future.try(" + (showf(this._fn)) + ")");
};

function attempt(f){
  if(!isFunction(f)) { invalidArgument('Future.try', 0, 'be a function', f); }
  return new Attempt(f);
}

var Cold = Cached.Cold = 0;
var Pending = Cached.Pending = 1;
var Rejected$1 = Cached.Rejected = 2;
var Resolved$1 = Cached.Resolved = 3;

function Queued(rej, res){
  this[Rejected$1] = rej;
  this[Resolved$1] = res;
}

function Cached(pure){
  this._pure = pure;
  this.reset();
}

Cached.prototype = Object.create(Core);

Cached.prototype.isRejected = function Cached$isRejected(){
  return this._state === Rejected$1;
};

Cached.prototype.isResolved = function Cached$isResolved(){
  return this._state === Resolved$1;
};

Cached.prototype.extractLeft = function Cached$extractLeft(){
  return this.isRejected() ? [this._value] : [];
};

Cached.prototype.extractRight = function Cached$extractRight(){
  return this.isResolved() ? [this._value] : [];
};

Cached.prototype._addToQueue = function Cached$addToQueue(rej, res){
  var _this = this;
  if(_this._state > Pending) { return noop; }
  var i = _this._queue.push(new Queued(rej, res)) - 1;
  _this._queued = _this._queued + 1;

  return function Cached$removeFromQueue(){
    if(_this._state > Pending) { return; }
    _this._queue[i] = undefined;
    _this._queued = _this._queued - 1;
    if(_this._queued === 0) { _this.reset(); }
  };
};

Cached.prototype._drainQueue = function Cached$drainQueue(){
  if(this._state <= Pending) { return; }
  if(this._queued === 0) { return; }
  var queue = this._queue;
  var length = queue.length;
  var state = this._state;
  var value = this._value;

  for(var i = 0; i < length; i++){
    queue[i] && queue[i][state](value);
    queue[i] = undefined;
  }

  this._queue = undefined;
  this._queued = 0;
};

Cached.prototype.reject = function Cached$reject(reason){
  if(this._state > Pending) { return; }
  this._value = reason;
  this._state = Rejected$1;
  this._drainQueue();
};

Cached.prototype.resolve = function Cached$resolve(value){
  if(this._state > Pending) { return; }
  this._value = value;
  this._state = Resolved$1;
  this._drainQueue();
};

Cached.prototype.run = function Cached$run(){
  var _this = this;
  if(_this._state > Cold) { return; }
  _this._state = Pending;
  _this._cancel = _this._pure._fork(
    function Cached$fork$rej(x){ _this.reject(x); },
    function Cached$fork$res(x){ _this.resolve(x); }
  );
};

Cached.prototype.reset = function Cached$reset(){
  if(this._state === Cold) { return; }
  if(this._state > Pending) { this._cancel(); }
  this._cancel = noop;
  this._queue = [];
  this._queued = 0;
  this._value = undefined;
  this._state = Cold;
};

Cached.prototype._fork = function Cached$_fork(rej, res){
  var cancel = noop;

  switch(this._state){
    case Pending: cancel = this._addToQueue(rej, res); break;
    case Rejected$1: rej(this._value); break;
    case Resolved$1: res(this._value); break;
    default: cancel = this._addToQueue(rej, res); this.run();
  }

  return cancel;
};

Cached.prototype.toString = function Cached$toString(){
  return ("Future.cache(" + (this._pure.toString()) + ")");
};

function cache(m){
  if(!isFuture(m)) { invalidFuture('Future.cache', 0, m); }
  return new Cached(m);
}

function Encase(fn, a){
  this._fn = fn;
  this._a = a;
}

Encase.prototype = Object.create(Core);

Encase.prototype._fork = function Encase$fork(rej, res){
  var r;
  try{ r = this._fn(this._a); }catch(e){ rej(e); return noop }
  res(r);
  return noop;
};

Encase.prototype.toString = function Encase$toString(){
  var ref = this;
  var _fn = ref._fn;
  var _a = ref._a;
  return ("Future.encase(" + (showf(_fn)) + ", " + (show(_a)) + ")");
};

function encase(f, x){
  if(!isFunction(f)) { invalidArgument('Future.encase', 0, 'be a function', f); }
  if(arguments.length === 1) { return partial1(encase, f); }
  return new Encase(f, x);
}

function Encase2(fn, a, b){
  this._fn = fn;
  this._a = a;
  this._b = b;
}

Encase2.prototype = Object.create(Core);

Encase2.prototype._fork = function Encase2$fork(rej, res){
  var r;
  try{ r = this._fn(this._a, this._b); }catch(e){ rej(e); return noop }
  res(r);
  return noop;
};

Encase2.prototype.toString = function Encase2$toString(){
  var ref = this;
  var _fn = ref._fn;
  var _a = ref._a;
  var _b = ref._b;
  return ("Future.encase2(" + (showf(_fn)) + ", " + (show(_a)) + ", " + (show(_b)) + ")");
};

function encase2(f, x, y){
  if(!isFunction(f)) { invalidArgument('Future.encase2', 0, 'be a function', f); }

  switch(arguments.length){
    case 1: return partial1(encase2, f);
    case 2: return partial2(encase2, f, x);
    default: return new Encase2(f, x, y);
  }
}

function Encase3(fn, a, b, c){
  this._fn = fn;
  this._a = a;
  this._b = b;
  this._c = c;
}

Encase3.prototype = Object.create(Core);

Encase3.prototype._fork = function Encase3$fork(rej, res){
  var r;
  try{ r = this._fn(this._a, this._b, this._c); }catch(e){ rej(e); return noop }
  res(r);
  return noop;
};

Encase3.prototype.toString = function Encase3$toString(){
  var ref = this;
  var _fn = ref._fn;
  var _a = ref._a;
  var _b = ref._b;
  var _c = ref._c;
  return ("Future.encase3(" + (showf(_fn)) + ", " + (show(_a)) + ", " + (show(_b)) + ", " + (show(_c)) + ")");
};

function encase3(f, x, y, z){
  if(!isFunction(f)) { invalidArgument('Future.encase3', 0, 'be a function', f); }

  switch(arguments.length){
    case 1: return partial1(encase3, f);
    case 2: return partial2(encase3, f, x);
    case 3: return partial3(encase3, f, x, y);
    default: return new Encase3(f, x, y, z);
  }
}

function EncaseN(fn, a){
  this._fn = fn;
  this._a = a;
}

EncaseN.prototype = Object.create(Core);

EncaseN.prototype._fork = function EncaseN$fork(rej, res){
  var open = true;
  this._fn(this._a, function EncaseN$done(err, val){
    if(open){
      open = false;
      err ? rej(err) : res(val);
    }
  });
  return function EncaseN$cancel(){ open = false; };
};

EncaseN.prototype.toString = function EncaseN$toString(){
  var ref = this;
  var _fn = ref._fn;
  var _a = ref._a;
  return ("Future.encaseN(" + (showf(_fn)) + ", " + (show(_a)) + ")");
};

function encaseN(f, x){
  if(!isFunction(f)) { invalidArgument('Future.encaseN', 0, 'be a function', f); }
  if(arguments.length === 1) { return partial1(encaseN, f); }
  return new EncaseN(f, x);
}

function EncaseN2(fn, a, b){
  this._fn = fn;
  this._a = a;
  this._b = b;
}

EncaseN2.prototype = Object.create(Core);

EncaseN2.prototype._fork = function EncaseN2$fork(rej, res){
  var open = true;
  this._fn(this._a, this._b, function EncaseN2$done(err, val){
    if(open){
      open = false;
      err ? rej(err) : res(val);
    }
  });
  return function EncaseN2$cancel(){ open = false; };
};

EncaseN2.prototype.toString = function EncaseN2$toString(){
  var ref = this;
  var _fn = ref._fn;
  var _a = ref._a;
  var _b = ref._b;
  return ("Future.encaseN2(" + (showf(_fn)) + ", " + (show(_a)) + ", " + (show(_b)) + ")");
};

function encaseN2(f, x, y){
  if(!isFunction(f)) { invalidArgument('Future.encaseN2', 0, 'be a function', f); }

  switch(arguments.length){
    case 1: return partial1(encaseN2, f);
    case 2: return partial2(encaseN2, f, x);
    default: return new EncaseN2(f, x, y);
  }
}

function EncaseN$1(fn, a, b, c){
  this._fn = fn;
  this._a = a;
  this._b = b;
  this._c = c;
}

EncaseN$1.prototype = Object.create(Core);

EncaseN$1.prototype._fork = function EncaseN$3$fork(rej, res){
  var open = true;
  this._fn(this._a, this._b, this._c, function EncaseN$3$done(err, val){
    if(open){
      open = false;
      err ? rej(err) : res(val);
    }
  });
  return function EncaseN$3$cancel(){ open = false; };
};

EncaseN$1.prototype.toString = function EncaseN$3$toString(){
  var ref = this;
  var _fn = ref._fn;
  var _a = ref._a;
  var _b = ref._b;
  var _c = ref._c;
  return ("Future.encaseN3(" + (showf(_fn)) + ", " + (show(_a)) + ", " + (show(_b)) + ", " + (show(_c)) + ")");
};

function encaseN3(f, x, y, z){
  if(!isFunction(f)) { invalidArgument('Future.encaseN3', 0, 'be a function', f); }

  switch(arguments.length){
    case 1: return partial1(encaseN3, f);
    case 2: return partial2(encaseN3, f, x);
    case 3: return partial3(encaseN3, f, x, y);
    default: return new EncaseN$1(f, x, y, z);
  }
}

function check$promise(p, f, a){
  return isThenable(p) ? p : typeError(
    'Future.encaseP expects the function it\'s given to return a Promise/Thenable'
    + "\n  Actual: " + (show(p)) + "\n  From calling: " + (showf(f))
    + "\n  With: " + (show(a))
  );
}

function EncaseP(fn, a){
  this._fn = fn;
  this._a = a;
}

EncaseP.prototype = Object.create(Core);

EncaseP.prototype._fork = function EncaseP$fork(rej, res){
  var ref = this;
  var _fn = ref._fn;
  var _a = ref._a;
  check$promise(_fn(_a), _fn, _a).then(escapeTick(res), escapeTick(rej));
  return noop;
};

EncaseP.prototype.toString = function EncaseP$toString(){
  var ref = this;
  var _fn = ref._fn;
  var _a = ref._a;
  return ("Future.encaseP(" + (showf(_fn)) + ", " + (show(_a)) + ")");
};

function encaseP(f, x){
  if(!isFunction(f)) { invalidArgument('Future.encaseP', 0, 'be a function', f); }
  if(arguments.length === 1) { return partial1(encaseP, f); }
  return new EncaseP(f, x);
}

function check$promise$1(p, f, a, b){
  return isThenable(p) ? p : typeError(
    'Future.encaseP2 expects the function it\'s given to return a Promise/Thenable'
    + "\n  Actual: " + (show(p)) + "\n  From calling: " + (showf(f))
    + "\n  With 1: " + (show(a))
    + "\n  With 2: " + (show(b))
  );
}

function EncaseP2(fn, a, b){
  this._fn = fn;
  this._a = a;
  this._b = b;
}

EncaseP2.prototype = Object.create(Core);

EncaseP2.prototype._fork = function EncaseP2$fork(rej, res){
  var ref = this;
  var _fn = ref._fn;
  var _a = ref._a;
  var _b = ref._b;
  check$promise$1(_fn(_a, _b), _fn, _a, _b).then(escapeTick(res), escapeTick(rej));
  return noop;
};

EncaseP2.prototype.toString = function EncaseP2$toString(){
  var ref = this;
  var _fn = ref._fn;
  var _a = ref._a;
  var _b = ref._b;
  return ("Future.encaseP2(" + (showf(_fn)) + ", " + (show(_a)) + ", " + (show(_b)) + ")");
};

function encaseP2(f, x, y){
  if(!isFunction(f)) { invalidArgument('Future.encaseP2', 0, 'be a function', f); }

  switch(arguments.length){
    case 1: return partial1(encaseP2, f);
    case 2: return partial2(encaseP2, f, x);
    default: return new EncaseP2(f, x, y);
  }
}

function check$promise$2(p, f, a, b, c){
  return isThenable(p) ? p : typeError(
    'Future.encaseP3 expects the function it\'s given to return a Promise/Thenable'
    + "\n  Actual: " + (show(p)) + "\n  From calling: " + (showf(f))
    + "\n  With 1: " + (show(a))
    + "\n  With 2: " + (show(b))
    + "\n  With 3: " + (show(c))
  );
}

function EncaseP3(fn, a, b, c){
  this._fn = fn;
  this._a = a;
  this._b = b;
  this._c = c;
}

EncaseP3.prototype = Object.create(Core);

EncaseP3.prototype._fork = function EncaseP3$fork(rej, res){
  var ref = this;
  var _fn = ref._fn;
  var _a = ref._a;
  var _b = ref._b;
  var _c = ref._c;
  check$promise$2(_fn(_a, _b, _c), _fn, _a, _b, _c).then(escapeTick(res), escapeTick(rej));
  return noop;
};

EncaseP3.prototype.toString = function EncaseP3$toString(){
  var ref = this;
  var _fn = ref._fn;
  var _a = ref._a;
  var _b = ref._b;
  var _c = ref._c;
  return ("Future.encaseP3(" + (show(_fn)) + ", " + (show(_a)) + ", " + (show(_b)) + ", " + (show(_c)) + ")");
};

function encaseP3(f, x, y, z){
  if(!isFunction(f)) { invalidArgument('Future.encaseP3', 0, 'be a function', f); }

  switch(arguments.length){
    case 1: return partial1(encaseP3, f);
    case 2: return partial2(encaseP3, f, x);
    case 3: return partial3(encaseP3, f, x, y);
    default: return new EncaseP3(f, x, y, z);
  }
}

/*eslint consistent-return: 0*/

var check$iterator = function (g) { return isIterator(g) ? g : invalidArgument(
  'Future.do', 0, 'return an iterator, maybe you forgot the "*"', g
); };

var check$iteration = function (o) {
  if(!isIteration(o)) { typeError(
    'Future.do was given an invalid generator:'
    + ' Its iterator did not return a valid iteration from iterator.next()'
    + "\n  Actual: " + (show(o))
  ); }
  if(o.done || isFuture(o.value)) { return o; }
  return invalidFuture(
    'Future.do',
    'the iterator to produce only valid Futures',
    o.value,
    '\n  Tip: If you\'re using a generator, make sure you always yield a Future'
  );
};

function Go(generator){
  this._generator = generator;
}

Go.prototype = Object.create(Core);

Go.prototype._fork = function Go$_fork(rej, res){

  var iterator = check$iterator(this._generator());

  var timing = Undetermined, cancel = noop, state, value;

  function resolved(x){
    value = x;
    if(timing === Asynchronous) { return drain(); }
    timing = Synchronous;
    state = check$iteration(iterator.next(value));
  }

  function drain(){
    state = check$iteration(iterator.next(value));

    while(!state.done){
      timing = Undetermined;
      cancel = state.value._fork(rej, resolved);

      if(timing !== Synchronous){
        timing = Asynchronous;
        return;
      }
    }

    res(state.value);
  }

  drain();

  return function Go$cancel(){ cancel(); };

};

Go.prototype.toString = function Go$toString(){
  return ("Future.do(" + (showf(this._generator)) + ")");
};

function go(generator){
  if(!isFunction(generator)) { invalidArgument('Future.do', 0, 'be a Function', generator); }
  return new Go(generator);
}

function check$dispose(m, f, x){
  if(!isFuture(m)) { invalidFuture(
    'Future.hook',
    'the first function it\'s given to return a Future',
    m,
    ("\n  From calling: " + (showf(f)) + "\n  With: " + (show(x)))
  ); }
}

function check$consume(m, f, x){
  if(!isFuture(m)) { invalidFuture(
    'Future.hook',
    'the second function it\'s given to return a Future',
    m,
    ("\n  From calling: " + (showf(f)) + "\n  With: " + (show(x)))
  ); }
}

function Hook(acquire, dispose, consume){
  this._acquire = acquire;
  this._dispose = dispose;
  this._consume = consume;
}

Hook.prototype = Object.create(Core);

Hook.prototype._fork = function Hook$fork(rej, res){

  var ref = this;
  var _acquire = ref._acquire;
  var _dispose = ref._dispose;
  var _consume = ref._consume;
  var cancel, cancelAcquire = noop, cancelConsume = noop, resource, value, cont = noop;

  function Hook$done(){
    cont(value);
  }

  function Hook$dispose(){
    var disposal = _dispose(resource);
    check$dispose(disposal, _dispose, resource);
    cancel = disposal._fork(rej, Hook$done);
    return cancel;
  }

  function Hook$cancelConsuption(){
    cancelConsume();
    Hook$dispose()();
  }

  function Hook$consumptionRejected(x){
    cont = rej;
    value = x;
    Hook$dispose();
  }

  function Hook$consumptionResolved(x){
    cont = res;
    value = x;
    Hook$dispose();
  }

  function Hook$acquireResolved(x){
    resource = x;
    var consumption = _consume(resource);
    check$consume(consumption, _consume, resource);
    cancel = Hook$cancelConsuption;
    cancelConsume = consumption._fork(Hook$consumptionRejected, Hook$consumptionResolved);
  }

  cancelAcquire = _acquire._fork(rej, Hook$acquireResolved);

  cancel = cancel || cancelAcquire;

  return function Hook$fork$cancel(){ cancel(); };

};

Hook.prototype.toString = function Hook$toString(){
  var ref = this;
  var _acquire = ref._acquire;
  var _dispose = ref._dispose;
  var _consume = ref._consume;
  return ("Future.hook(" + (_acquire.toString()) + ", " + (showf(_dispose)) + ", " + (showf(_consume)) + ")");
};

function hook$acquire$cleanup(acquire, cleanup, consume){
  if(!isFunction(consume)) { invalidArgument('Future.hook', 2, 'be a Future', consume); }
  return new Hook(acquire, cleanup, consume);
}

function hook$acquire(acquire, cleanup, consume){
  if(!isFunction(cleanup)) { invalidArgument('Future.hook', 1, 'be a function', cleanup); }
  if(arguments.length === 2) { return partial2(hook$acquire$cleanup, acquire, cleanup); }
  return hook$acquire$cleanup(acquire, cleanup, consume);
}

function hook(acquire, cleanup, consume){
  if(!isFuture(acquire)) { invalidFuture('Future.hook', 0, acquire); }
  if(arguments.length === 1) { return partial1(hook$acquire, acquire); }
  if(arguments.length === 2) { return hook$acquire(acquire, cleanup); }
  return hook$acquire(acquire, cleanup, consume);
}

function Node(fn){
  this._fn = fn;
}

Node.prototype = Object.create(Core);

Node.prototype._fork = function Node$fork(rej, res){
  var open = true;
  this._fn(function Node$done(err, val){
    if(open){
      open = false;
      err ? rej(err) : res(val);
    }
  });
  return function Node$cancel(){ open = false; };
};

Node.prototype.toString = function Node$toString(){
  var ref = this;
  var _fn = ref._fn;
  return ("Future.node(" + (showf(_fn)) + ")");
};

function node(f){
  if(!isFunction(f)) { invalidArgument('Future.node', 0, 'be a function', f); }
  return new Node(f);
}

var index$7 = createCommonjsModule(function (module) {
(function(global, f){

  'use strict';

  /*istanbul ignore next*/
  if(module && 'object' !== 'undefined'){
    module.exports = f(index$2, index$5);
  }else{
    global.concurrify = f(global.sanctuaryTypeClasses, global.sanctuaryTypeIdentifiers);
  }

}(/*istanbul ignore next*/(commonjsGlobal || window || commonjsGlobal), function(Z, type){

  'use strict';

  var $alt = 'fantasy-land/alt';
  var $ap = 'fantasy-land/ap';
  var $map = 'fantasy-land/map';
  var $of = 'fantasy-land/of';
  var $zero = 'fantasy-land/zero';
  var $$type = '@@type';

  var ordinal = ['first', 'second', 'third', 'fourth', 'fifth'];

  function isFunction(f){
    return typeof f === 'function';
  }

  function isBinary(f){
    return f.length >= 2;
  }

  function isApplicativeRepr(Repr){
    try{
      return Z.Applicative.test(Z.of(Repr));
    }catch(_){
      return false;
    }
  }

  function invalidArgument(it, at, expected, actual){
    throw new TypeError(
      it
      + ' expects its '
      + ordinal[at]
      + ' argument to '
      + expected
      + '\n  Actual: '
      + Z.toString(actual)
    );
  }

  function invalidContext(it, actual, an){
    throw new TypeError(
      it + ' was invoked outside the context of a ' + an + '. \n  Called on: ' + Z.toString(actual)
    );
  }

  //       getTypeIdentifier :: TypeRepresentative -> TypeIdentifier
  function getTypeIdentifier(Repr){
    return Repr[$$type] || Repr.name || 'Anonymous';
  }

  //       generateTypeIdentifier :: TypeIdentifier -> TypeIdentifier
  function generateTypeIdentifier(identifier){
    var o = type.parse(identifier);
    return (o.namespace || 'concurrify') + '/Concurrent' + o.name + '@' + o.version;
  }

  //concurrify :: Applicative m
  //           => (TypeRep m, m a, (m a, m a) -> m a, (m a, m (a -> b)) -> m b)
  //           -> Concurrently m
  return function concurrify(Repr, zero, alt, ap){

    var INNERTYPE = getTypeIdentifier(Repr);
    var OUTERTYPE = generateTypeIdentifier(INNERTYPE);

    var INNERNAME = type.parse(INNERTYPE).name;
    var OUTERNAME = type.parse(OUTERTYPE).name;

    function Concurrently(sequential){
      this.sequential = sequential;
    }

    function isInner(x){
      return x instanceof Repr
      || (Boolean(x) && x.constructor === Repr)
      || type(x) === Repr[$$type];
    }

    function isOuter(x){
      return x instanceof Concurrently
      || (Boolean(x) && x.constructor === Concurrently)
      || type(x) === OUTERTYPE;
    }

    function construct(x){
      if(!isInner(x)) { invalidArgument(OUTERNAME, 0, 'be of type "' + INNERNAME + '"', x); }
      return new Concurrently(x);
    }

    if(!isApplicativeRepr(Repr)) { invalidArgument('concurrify', 0, 'represent an Applicative', Repr); }
    if(!isInner(zero)) { invalidArgument('concurrify', 1, 'be of type "' + INNERNAME + '"', zero); }
    if(!isFunction(alt)) { invalidArgument('concurrify', 2, 'be a function', alt); }
    if(!isBinary(alt)) { invalidArgument('concurrify', 2, 'be binary', alt); }
    if(!isFunction(ap)) { invalidArgument('concurrify', 3, 'be a function', ap); }
    if(!isBinary(ap)) { invalidArgument('concurrify', 3, 'be binary', ap); }

    var proto = Concurrently.prototype = construct.prototype = {constructor: construct};

    construct[$$type] = OUTERTYPE;

    var mzero = new Concurrently(zero);
    construct[$zero] = function Concurrently$zero(){
      return mzero;
    };

    construct[$of] = function Concurrently$of(value){
      return new Concurrently(Z.of(Repr, value));
    };

    proto[$map] = function Concurrently$map(mapper){
      if(!isOuter(this)) { invalidContext(OUTERNAME + '#map', this, OUTERNAME); }
      if(!isFunction(mapper)) { invalidArgument(OUTERNAME + '#map', 0, 'be a function', mapper); }
      return new Concurrently(Z.map(mapper, this.sequential));
    };

    proto[$ap] = function Concurrently$ap(m){
      if(!isOuter(this)) { invalidContext(OUTERNAME + '#ap', this, OUTERNAME); }
      if(!isOuter(m)) { invalidArgument(OUTERNAME + '#ap', 0, 'be a ' + OUTERNAME, m); }
      return new Concurrently(ap(this.sequential, m.sequential));
    };

    proto[$alt] = function Concurrently$alt(m){
      if(!isOuter(this)) { invalidContext(OUTERNAME + '#alt', this, OUTERNAME); }
      if(!isOuter(m)) { invalidArgument(OUTERNAME + '#alt', 0, 'be a ' + OUTERNAME, m); }
      return new Concurrently(alt(this.sequential, m.sequential));
    };

    proto.toString = function Concurrently$toString(){
      if(!isOuter(this)) { invalidContext(OUTERNAME + '#toString', this, OUTERNAME); }
      return OUTERNAME + '(' + Z.toString(this.sequential) + ')';
    };

    return construct;

  };

}));
});

function check$ap$f(f){
  if(!isFunction(f)) { typeError(
    'Future#ap expects its first argument to be a Future of a Function'
    + "\n  Actual: Future.of(" + (show(f)) + ")"
  ); }
}

function ParallelAp(mval, mfunc){
  this._mval = mval;
  this._mfunc = mfunc;
}

ParallelAp.prototype = Object.create(Core);

ParallelAp.prototype._fork = function ParallelAp$fork(rej, res){
  var func, val, okval = false, okfunc = false, rejected = false, c1, c2;

  function ParallelAp$rej(x){
    if(!rejected){
      rejected = true;
      rej(x);
    }
  }

  c1 = this._mval._fork(ParallelAp$rej, function ParallelAp$fork$resVal(x){
    c1 = noop;
    if(!okval) { return void (okfunc = true, val = x); }
    res(func(x));
  });
  c2 = this._mfunc._fork(ParallelAp$rej, function ParallelAp$fork$resFunc(f){
    c2 = noop;
    check$ap$f(f);
    if(!okfunc) { return void (okval = true, func = f); }
    res(f(val));
  });

  return function ParallelAp$fork$cancel(){
    c1();
    c2();
  };
};

ParallelAp.prototype.toString = function ParallelAp$toString(){
  return ("new ParallelAp(" + (this._mval.toString()) + ", " + (this._mfunc.toString()) + ")");
};

var Par = index$7(Future$1, never, race, function pap(mval, mfunc){
  return new ParallelAp(mval, mfunc);
});

Par.of = Par[FL.of];
Par.zero = Par[FL.zero];
Par.map = map;
Par.ap = ap;
Par.alt = alt;

function isParallel(x){
  return x instanceof Par || index$5(x) === Par['@@type'];
}

function seq(par){
  if(!isParallel(par)) { invalidArgument('Future.seq', 0, 'to be a Par', par); }
  return par.sequential;
}

var check$parallel = function (m, i) { return isFuture(m) ? m : invalidFuture(
  'Future.parallel',
  'its second argument to be an array of valid Futures. '
+ "The value at position " + i + " in the array is not a Future",
  m
); };

function Parallel(max, futures){
  this._futures = futures;
  this._length = futures.length;
  this._max = Math.min(this._length, max);
}

Parallel.prototype = Object.create(Core);

Parallel.prototype._fork = function Parallel$_fork(rej, res){

  var ref = this;
  var _futures = ref._futures;
  var _length = ref._length;
  var _max = ref._max;
  var cancels = new Array(_length), out = new Array(_length);
  var cursor = 0, running = 0, blocked = false;

  function Parallel$cancel(){
    for(var n = 0; n < _length; n++) { cancels[n] && cancels[n](); }
  }

  function Parallel$run(idx){
    running++;
    cancels[idx] = _futures[idx]._fork(function Parallel$rej(reason){
      cancels[idx] = noop;
      Parallel$cancel();
      rej(reason);
    }, function Parallel$res(value){
      cancels[idx] = noop;
      out[idx] = value;
      running--;
      if(cursor === _length && running === 0) { res(out); }
      else if(blocked) { Parallel$drain(); }
    });
  }

  function Parallel$drain(){
    blocked = false;
    while(cursor < _length && running < _max) { Parallel$run(cursor++); }
    blocked = true;
  }

  Parallel$drain();

  return Parallel$cancel;

};

Parallel.prototype.toString = function Parallel$toString(){
  return ("Future.parallel(" + (this._max) + ", " + (show(this._futures)) + ")");
};

var emptyArray = new Resolved([]);

function parallel$max(max, xs){
  if(!isArray(xs)) { invalidArgument('Future.parallel', 1, 'be an array', xs); }
  var futures = mapArray(xs, check$parallel);
  return futures.length === 0 ? emptyArray : new Parallel(max, futures);
}

function parallel(max, xs){
  if(!isUnsigned(max)) { invalidArgument('Future.parallel', 0, 'be a positive integer', max); }
  if(arguments.length === 1) { return partial1(parallel$max, max); }
  return parallel$max(max, xs);
}

function check$promise$3(p, f){
  return isThenable(p) ? p : typeError(
    'Future.tryP expects the function it\'s given to return a Promise/Thenable'
    + "\n  Actual: " + (show(p)) + "\n  From calling: " + (showf(f))
  );
}

function TryP(fn){
  this._fn = fn;
}

TryP.prototype = Object.create(Core);

TryP.prototype._fork = function TryP$fork(rej, res){
  var ref = this;
  var _fn = ref._fn;
  check$promise$3(_fn(), _fn).then(escapeTick(res), escapeTick(rej));
  return noop;
};

TryP.prototype.toString = function TryP$toString(){
  var ref = this;
  var _fn = ref._fn;
  return ("Future.tryP(" + (show(_fn)) + ")");
};

function tryP(f){
  if(!isFunction(f)) { invalidArgument('Future.tryP', 0, 'be a function', f); }
  return new TryP(f);
}

if(typeof Object.create !== 'function') { error('Please polyfill Object.create to use Fluture'); }
if(typeof Object.assign !== 'function') { error('Please polyfill Object.assign to use Fluture'); }
if(typeof Array.isArray !== 'function') { error('Please polyfill Array.isArray to use Fluture'); }

var index$1 = Object.assign(Future$1, dispatchers, {
  Future: Future$1,
  after: after,
  attempt: attempt,
  cache: cache,
  do: go,
  encase: encase,
  encase2: encase2,
  encase3: encase3,
  encaseN: encaseN,
  encaseN2: encaseN2,
  encaseN3: encaseN3,
  encaseP: encaseP,
  encaseP2: encaseP2,
  encaseP3: encaseP3,
  go: go,
  hook: hook,
  isFuture: isFuture,
  isNever: isNever,
  never: never,
  node: node,
  of: of,
  Par: Par,
  parallel: parallel,
  reject: reject,
  rejectAfter: rejectAfter,
  seq: seq,
  try: attempt,
  tryP: tryP,
});

return index$1;

}());
