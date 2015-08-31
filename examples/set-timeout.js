var io = require('indian-ocean')

require('../src/nodebooks.js').nodeSafe()

var data = io.readDataSync('./examples/data/test.csv')

var numbs = [1,2,3]

__(data)
__(numbs)

numbs.forEach(function (num) {
  __(num*num);
});

setTimeout( function () {
  __('it works!');
}, 1000 );

var id = setTimeout( function () {
  __( 'this should not be displayed' );
}, 2000 );

clearTimeout( id );

var interval = setInterval( function () {
  __( 'the time is ' + new Date().toString() );
}, 1000 );

setTimeout( function () {
  clearInterval( interval );
}, 3500 );