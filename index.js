var io = require('indian-ocean')

var data = io.readDataSync('data/test.csv')

var numbs = [1,2,3]

display(data)
display(numbs)

numbs.forEach(function (num) {
	display(num*num);
});
