var tests = require('./compat-table/data-es6').tests;

var target = 'chrome46';
var targetVersion = parseInt(target.substring(target.length-2, target.length), 10);
var supported = [];
var notSupported = [];

for (var test of tests) {
    if (!test['subtests']) {
        continue;
    }
    
    var fullySupportedInVersion = 0;
    
    for (var subtest of test.subtests) {
        Object.keys(subtest.res).some(function(k) {
            if (~k.indexOf('chrome')) {
                var version = parseInt(k.substring(k.length-2, k.length), 10);
                
                if (version > fullySupportedInVersion) {
                    fullySupportedInVersion = version;
                }
            }
        });
    }
    
    if (fullySupportedInVersion <= targetVersion) {
        supported.push(test.name);
    } else {
        notSupported.push(test.name);
    }
}

console.log(target);

console.log('supported');
console.log(supported);

console.log('not supported');
console.log(notSupported);