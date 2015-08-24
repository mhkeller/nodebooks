var acorn = require('acorn')
var _ = require('underscore')
var fs = require('fs')

// Keep track of the data values
var peeks = []

// Read in our script and parse it
var script = fs.readFileSync('./index.js', 'utf-8')
var tree = acorn.parse(script, {locations: true})
// console.log(tree)

// How many calls to the `display` function do we have?
var display_calls = tree.body.filter(function(obj){
    return obj.type == 'ExpressionStatement' && obj.expression.callee.name == 'display'
  })

var numb_display_calls = display_calls.length

var showPeeks_after = _.after(numb_display_calls, showPeeks)

var script_lines = script.split('\n')

function showPeeks(){
  for (var i = display_calls.length - 1; i >= 0; i--) {
    var display_call = display_calls[i]
    var script_line_index = display_call.loc.end.line - 1
    var associated_peek = '````\n\nValue is: ' + JSON.stringify(peeks[i]) + '\n\n' // insert transformation step, simply stringify for now
    
    console.log(i, display_calls.length - 1)
    if (i < display_calls.length - 1) {
      associated_peek += '````js'
    }
    script_lines.splice(script_line_index + 1, 0, associated_peek)
  }

  fs.writeFileSync('nodebook.md', '````js\n'+script_lines.join('\n'))
}

function keepTrack(obj) {
  peeks.push(obj)
  // console.log(numb_display_calls)
  showPeeks_after()
}

module.exports = function(obj){
  keepTrack(obj)
}