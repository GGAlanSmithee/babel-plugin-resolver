var tests = require('./../compat-table/data-es6').tests;

exports.resolve = function(targets) {
    targets = buildTargets(targets);
    
    var notSupported = [];
    
    for (var target of targets) {
        for (var test of tests) {
            if (!test['subtests'] || notSupported[test.name]) {
                continue;
            }
            
            var fullySupportedInVersion = 0;
            
            for (var subtest of test.subtests) {
                Object.keys(subtest.res).some(function(k) {
                    if (~k.indexOf(target.name) && subtest.res[k] === true) {
                        var version = parseInt(k.substring(k.length-2, k.length), 10);
                        
                        if (version > fullySupportedInVersion) {
                            fullySupportedInVersion = version;
                        }
                    }
                });
            }
            
            if (fullySupportedInVersion > target.version) {
                notSupported.push(test.name);
            }
        }
    }
    
    return notSupported;
};

function buildTargets(targets) {
    if (!(targets instanceof Array)) {
        targets = [ targets ];
    }
    
    var retTargets = [];
    
    for (var target of targets) {
        var match = target.match(/\d+$/);
        
        if (match === null) {
            return;
        }
    
        retTargets.push({
            name : match.input.substring(0, match.index),
            version : match[0],
            notSupported : []
        });
    }
    
    return retTargets;
}