#!/usr/bin/env node

var fs = require('fs')
var nodebooks = require('../nodebooks')
var formats = require('../formats')

var file = process.argv[2]
console.log( file )

function formatPeek ( peek ) {
  return peek.results.map( function ( result, i ) {
    return ( peek.results.length > 1 ? '[' + i + ']: ' : '' ) + formats[peek.format]( result )
  }).join( '\n' ) + '\n\n';
}

function formatCode ( code ) {
  return '```js\n' + code.trim() + '\n```\n\n';
}

var code = fs.readFileSync(file, 'utf-8')

nodebooks.run(code, function (result) {
  var lines = code.split('\n');
  var peeks = []

  // TODO different outputters
  Object.keys(result).forEach(function (uid) {
    peeks.push(result[uid]);
  })

  peeks.sort(function (a, b) {
    return a.line - b.line;
  })

  var block = [];
  var blocks = [];
  var nextPeek = peeks.shift();
  var i;
  for ( i = 0; i < lines.length; i += 1 ) {
    if ( !nextPeek || i < nextPeek.line ) {
      block.push( lines[i] );
    } else {
      if ( block.length ) {
        blocks.push( formatCode( block.join('\n') ) );
        block = [ lines[i] ];
      }

      blocks.push( formatPeek( nextPeek ) );
      nextPeek = peeks.shift();
    }
  }

  blocks.push( formatCode( block.join( '\n' ) ) )

  console.log( blocks.join( '\n' ).trim() )
})
