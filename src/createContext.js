var vm = require('vm');

module.exports = function (overrides) {
  var context = {}
  var key

  for (key in global) {
    context[key] = global[key];
  }

  for (key in overrides) {
    context[key] = overrides[key];
  }

  return vm.createContext(context);
}
