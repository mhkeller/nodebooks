#!/usr/bin/env node

var fs = require('fs')
var nodebooks = require('../nodebooks')
var formats = require('../utils/formats')
var jsdom = require('jsdom')
var serializeDocument = jsdom.serializeDocument
var compileStylus = require('../utils/compile-stylus')

var file = process.argv[2]
console.log( file )

var page_formats = {
  md: {
    br: '\n',
    whitespace: ' ',
    peek: {
      open: '',
      close: ''
    },
    code: {
      open: '````js\n',
      close: '\n````\n\n'
    },
    createDoc: function( blocks, cb ) {

      cb( blocks.join('\n') )
    } 
  },
  html: {
    br: '<br/>',
    whitespace: '&nbsp;',
    code: {
      open: '<pre class="js-code"><code>',
      close: '</pre></code>'
    },
    peek: {
      open: '<div class="nb-view">',
      close: '</div>'
    },
    createDoc: function( blocks, cb ) {
      function createDocWithCss(css){
        // Create a new document
        var doc = jsdom.jsdom()

        var head = doc.getElementsByTagName('head')[0];
        var s = doc.createElement('style');
        s.setAttribute('type', 'text/css');
        if (s.styleSheet) {   // IE
            s.styleSheet.cssText = css;
        } else {                // the world
            s.appendChild(doc.createTextNode(css));
        }
        head.appendChild(s);
        return doc
      }

      compileStylus(null, function(err, css){
        var doc = createDocWithCss(css)
        var markup = serializeDocument(doc)
        console.log(blocks.join('\n'))

        markup = markup.replace('<body>','<body>' + blocks.join('\n'))

        cb(markup)
        
      })
    } 
  }
}

var page_format = page_formats['html']

function formatPeek ( peek, pageFormat ) {
  return peek.results.map( function ( result, i ) {
    return ( peek.results.length > 1 ? '[' + i + ']: ' : '' ) + formats[peek.format]( result, pageFormat )
  }).join( pageFormat.br ) + pageFormat.br + pageFormat.br;
}

function formatCode ( code, pageFormat ) {
  return pageFormat.code.open + code.trim() + pageFormat.code.close;
}

function formatPage( blocks, pageFormat, cb) {
  pageFormat.createDoc(blocks, cb)
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
        blocks.push( formatCode( block.join(page_format.br), page_format ) );
        block = [ lines[i] ];
      }


      blocks.push( formatPeek( nextPeek, page_format ) );
      nextPeek = peeks.shift();
    }
  }

  blocks.push( formatCode( block.join( page_format.br ), page_format ) )

  formatPage(blocks, page_format, function(pageText){
    console.log( pageText )
  })

})
