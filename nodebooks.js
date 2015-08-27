var acorn = require('acorn')
var _ = require('underscore')
var fs = require('fs')
var MagicString = require('magic-string')
var walk = require('estree-walker').walk
var vm = require('vm')
var createContext = require('./src/createContext')

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
    var timeouts = {};
    var intervals = {};

    function check () {
      if (!--pending) callback(display_calls);
    }

    var context = createContext({
      require: function ( mod ) {
        return require(mod); // TODO – resolve relative to the actual file, not nodebooks itself
      },
      display: function ( uid, data, format ) {
        display_calls[ uid ].format = format || 'js'
        display_calls[ uid ].results.push(JSON.stringify(data));
      },
      setTimeout: function ( fn, delay ) {
        pending += 1;
        var id = setTimeout( function () {
          timeouts[id] = null;
          fn();
          check();
        }, delay );
        timeouts[id] = true;
        return id;
      },
      clearTimeout: function ( id ) {
        if (timeouts[id]) check();
        timeouts[id] = null;
        clearTimeout(id);
      },
      setInterval: function ( fn, interval ) {
        pending += 1;
        var id = setInterval( fn, interval );
        intervals[id] = true;
        return id;
      },
      clearInterval: function ( id ) {
        if (intervals[id]) check();
        intervals[id] = null;
        clearInterval(id);
      }
    });

    vm.runInContext(magicString.toString(), context)

    if ( !pending ) {
      callback(display_calls);
    }
  }
}
