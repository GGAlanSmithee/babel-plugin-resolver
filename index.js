var tests = require('./compat-table/data-es6').tests;

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
    
    console.log(test.name, 'is fully supported in chrome version ', fullySupportedInVersion);
}