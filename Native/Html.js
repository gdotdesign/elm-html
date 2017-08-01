class Program {
  constructor (program) {
    this.model = program.init
    this.view = program.view
    this.render()
  }

  render () {
    console.log(this.view(this.model))
  }
}

var _gdotdesign$elm_html$Native_Html = (function () {
  function program(impl) {
    return function(flagDecoder) {
      return function(object, moduleName, debugMetadata) {
        object.fullscreen = function(){
          new Program(impl)
        }
      };
    };
  }

  function programWithFlags(impl) {
    return function(flagDecoder) {
      return function(object, moduleName, debugMetadata) {
        object.start = function start(onAppReady, flags = {}) {
          var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
          if (result.ctor === 'Err')
          {
            throw new Error(
              moduleName + '.start(...) was called with an unexpected argument.\n'
              + 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
              + result._0
            );
          }

          console.log(impl, flagDecoder, object, moduleName, debugMetadata, result)
        };
      };
    };
  }

  return {
    programWithFlags: programWithFlags,
    program: program
  }
}())
