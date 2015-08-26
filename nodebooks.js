var acorn = require('acorn')
var _ = require('underscore')
var fs = require('fs')
var MagicString = require('magic-string')
var walk = require('estree-walker').walk
var vm = require('vm')

module.exports = {
  run: function ( script, callback ) {
    var magicString = new MagicString(script)
    var tree = acorn.parse(script, {locations: true})

    // Instrument display calls
    var display_calls = {};
    var uid = 0;
    walk(tree, {
      enter: function (node) {
        if (node.type === 'CallExpression' && node.callee.name === 'display') {
          display_calls[ uid ] = {
            line: node.loc.end.line,
            results: []
          };

          magicString.insert(node.arguments[0].start, '' + uid + ', ');
          uid += 1;
        }
      }
    });

    // monkey patch async stuff. TODO literally everything else besides setTimeout
    var pending = 0;

    var setTimeout = global.setTimeout;
    global.setTimeout = function ( fn, delay ) {
      pending += 1;
      return setTimeout( function () {
        fn();
        if ( !--pending ) callback( result );
      }, delay );
    }

    var result = '';

    global.display = function ( uid, data ) {
      display_calls[ uid ].results.push(data);
    };

    var context = vm.createContext({
      display: function ( uid, data ) {
        display_calls[ uid ].results.push(data);
      },
      require: require
    });

    vm.runInContext(magicString.toString(), context)

    if ( !pending ) {
      callback(display_calls);
    }
  }
}
