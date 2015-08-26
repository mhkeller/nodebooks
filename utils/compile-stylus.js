var stylus = require('stylus')
var nib = require('nib')
var fs = require('fs')
var path = require('path')

function compile(stylPath, cb){
  // TODO, set this up so you could pass in a location to a stylesheet 
  stylPath = stylPath || path.join(__dirname, 'styles.styl')
  var str = fs.readFileSync(stylPath, 'utf-8')

  stylus(str)
    .use(nib())
    .import('nib')
    .set('compress', true)
    .render(function(err, css){
      cb(err, css)
    });
}

module.exports = compile