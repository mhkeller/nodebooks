````js
var io = require('indian-ocean')

var display = require('./nodebooks.js')
var data = io.readDataSync('data/test.csv')

var numbs = [1,2,3]

display(data)
````

Value is: [{"name":"mhk","value":"28"},{"name":"jrr","value":"22"}]

````js
display(numbs)
````

Value is: [1,2,3]


