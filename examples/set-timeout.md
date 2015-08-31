````js
var io = require('indian-ocean')

require('../src/nodebooks.js').nodeSafe()

var data = io.readDataSync('./examples/data/test.csv')

var numbs = [1,2,3]

__(data)
````


[
  {
    "name": "mhk",
    "value": "28"
  },
  {
    "name": "jrr",
    "value": "22"
  }
]


````js
__(numbs)
````


[
  1,
  2,
  3
]


````js
numbs.forEach(function (num) {
  __(num*num);
````


[0]: 1
[1]: 4
[2]: 9


````js
});

setTimeout( function () {
  __('it works!');
````


"it works!"


````js
}, 1000 );

var id = setTimeout( function () {
  __( 'this should not be displayed' );
````





````js
}, 2000 );

clearTimeout( id );

var interval = setInterval( function () {
  __( 'the time is ' + new Date().toString() );
````


[0]: "the time is Mon Aug 31 2015 02:03:47 GMT-0400 (EDT)"
[1]: "the time is Mon Aug 31 2015 02:03:48 GMT-0400 (EDT)"
[2]: "the time is Mon Aug 31 2015 02:03:49 GMT-0400 (EDT)"


````js
}, 1000 );

setTimeout( function () {
  clearInterval( interval );
}, 3500 );
````


