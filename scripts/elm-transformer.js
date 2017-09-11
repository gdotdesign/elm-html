var spawn = require('child_process').spawnSync
var which = require('npm-which')(__dirname)
var temp = require('temp').track()
var babel = require('babel-core')
var fs = require('fs')

var elmExecutable = which.sync('elm-make')
var render = function (file) {
  var filename = temp.openSync({ suffix: '.js' }).path

  var args =
    [file, '--output', filename, '--yes', '--warn', '--report=json']

  spawn(elmExecutable, args, { encoding: 'utf-8' })

  return babel
    .transform(
      fs.readFileSync(filename, 'utf-8'),
       { presets: [['es2015', { modules: false }]] })
    .code
}

module.exports = {
  process: function (src, filename) {
    return render(filename)
  }
}
