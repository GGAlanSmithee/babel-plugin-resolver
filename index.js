var resolve = require('./src/index').resolve;

var requiredBabelPlugins = resolve(['ie10']).requiredBabelPlugins;

console.log(requiredBabelPlugins);