class Program {
  constructor (program) {
    this.element = this.createRoot()
    this.updatePromise = Promise.resolve(null)
    this.program = program
    this.map = new Map()
    this.render()
  }

  createRoot () {
    var element =document.createElement('div')
    document.body.appendChild(element)
    return element
  }

  update (fn, branch) {
    console.log(branch)

    fn(function(){ return this.map.get(branch) }.bind(this)).then(function(model){
      this.map.set(branch, model)
      this.render()
    }.bind(this))
  }

  transformElements(elements, branch) {
    return _elm_lang$core$Native_List
      .toArray(elements)
      .map(function(element, index){
        return this.transformElement(element, branch + "-" + index)
      }.bind(this))
  }

  transformElement(element, branch) {
    switch (element.ctor) {
      case "C":
        if (!this.map.has(branch)) { this.map.set(branch, element.defaults) }
        var data = this.map.get(branch)
        return this.transformElement(element.view(data), branch)
      case "T":
        return element._0
      case "N":
        return Inferno.createElement(
          element._0.tag,
          this.transformAttributes(element._0.attributes, branch),
          this.transformElements(element._0.contents, branch)
        )
    }
  }

  transformAttributes(attributes, branch) {
    var result = {}

    _elm_lang$core$Native_List.toArray(attributes).forEach(function(attribute){
      switch (attribute.ctor) {
        case "Event":
          result[attribute._0] = function(event) {
            this.update(attribute._1(event), branch)
          }.bind(this)
        break
      }
    }.bind(this))

    return result
  }

  render () {
    var root = this.transformElement(this.program, "0")
    Inferno.render(root, this.element)
  }
}

var _gdotdesign$elm_html$Native_Html = (function () {
  function program(impl) {
    return function(flagDecoder) {
      return function(object, moduleName, debugMetadata) {
        object.fullscreen = function(){
          new Program(impl)
        }
      }
    }
  }

  function programWithFlags(impl) {
    return function(flagDecoder) {
      return function(object, moduleName, debugMetadata) {
        object.start = function start(onAppReady, flags = {}) {
          var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags)
          if (result.ctor === 'Err')
          {
            throw new Error(
              moduleName + '.start(...) was called with an unexpected argument.\n'
              + 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
              + result._0
            )
          }

          console.log(impl, flagDecoder, object, moduleName, debugMetadata, result)
        }
      }
    }
  }

  return {
    programWithFlags: programWithFlags,
    program: program,
    component: F2(function(view, defaults) {
      return { ctor: 'C', view: view, defaults: defaults }
    })
  }
}())
