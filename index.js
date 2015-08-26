var io = require('indian-ocean')

var data = io.readDataSync('data/test.csv')

var display = global.display || function(){}

var numbs = [1,2,3]

display(data)
display(numbs)

numbs.forEach(function (num) {
	display(num*num);
});

setTimeout( function () {
	display('it works!');
}, 1000 );

var id = setTimeout( function () {
	display( 'this should not be displayed' );
}, 2000 );

clearTimeout( id );

var interval = setInterval( function () {
	display( 'the time is ' + new Date().toString() );
}, 1000 );

setTimeout( function () {
	clearInterval( interval );
}, 3500 );