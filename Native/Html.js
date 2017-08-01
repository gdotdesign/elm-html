class Program {
  constructor (program) {
    this.element = this.createRoot()
    this.model = program.init
    this.updatePromise = Promise.resolve(null)
    this.view = program.view
    this.render()
  }

  createRoot () {
    var element =document.createElement('div')
    document.body.appendChild(element)
    return element
  }

  update (fn) {
    // This is sequenced update

    /*this.updatePromise = this.updatePromise.then(function(){
      return fn(this.model).then(function(model){
        this.model = model
        this.render()
      }.bind(this))
    }.bind(this))*/

    fn(this.getModel.bind(this)).then(function(model){
      this.model = model
      this.render()
    }.bind(this))
  }

  getModel() {
    return this.model
  }

  transformElements(elements) {
    return _elm_lang$core$Native_List.toArray(elements).map(function(element){
      return this.transformElement(element)
    }.bind(this))
  }

  transformElement(element) {
    switch (element.ctor) {
      case "C":
        console.log(element)
        break
      case "T":
        return element._0
      case "N":
        return Inferno.createElement(
          element._0.tag,
          this.transformAttributes(element._0.attributes),
          this.transformElements(element._0.contents)
        )
    }
  }

  transformAttributes(attributes) {
    var result = {}

    _elm_lang$core$Native_List.toArray(attributes).forEach(function(attribute){
      switch (attribute.ctor) {
        case "Event":
          result[attribute._0] = function(event) {
            this.update(attribute._1(event))
          }.bind(this)
        break
      }
    }.bind(this))

    return result
  }

  render () {
    var root = this.transformElement(this.view(this.model))
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
    component: function(data) { return data }
  }
}())