var tests = require('./../compat-table/data-es6').tests;
var featuresMap = require('./featuresmap').featuresMap;

exports.resolve = function(targets) {
    targets = buildTargets(targets);
    
    var unsupportedFeatures = [];
    
    for (var target of targets) {
        for (var test of tests) {
            if (!test['subtests'] || unsupportedFeatures[test.name]) {
                continue;
            }
            
            var wasFound = false;
            var fullySupportedInVersion = 0;
            
            for (var subtest of test.subtests) {
                Object.keys(subtest.res).some(function(k) {
                    if (subtest.res[k] === true) {
                        if (~k.indexOf(target.name)) {
                            var version = parseInt(k.substring(k.length-2, k.length), 10);
                            
                            if (fullySupportedInVersion <= version) {
                                fullySupportedInVersion = version;
                            }
                            
                            wasFound = true;
                        } else if (target.name === 'edge' && ~k.indexOf('ie')) { // if in ie, it's also in edge
                            fullySupportedInVersion = 12;
                            
                            wasFound = true;
                        }
                    }
                });
            }

            if (!wasFound || fullySupportedInVersion > target.version) {
                unsupportedFeatures.push(test.name);
            }
        }
    }
    
    var requiredBabelPlugins = [];
    
    for (var feature of unsupportedFeatures) {
        var babelPlugin = featuresMap[feature];
        
        if (babelPlugin !== null && requiredBabelPlugins.indexOf(babelPlugin) === -1) {
            requiredBabelPlugins.push(babelPlugin);
        }
    }
    
    return { unsupportedFeatures, requiredBabelPlugins };
};

function buildTargets(targets) {
    if (!(targets instanceof Array)) {
        targets = [ targets ];
    }
    
    var retTargets = [];
    
    for (var target of targets) {
        var match = target.match(/\d+$/);
        
        if (match === null) {
            continue;
        }
    
        retTargets.push({
            name : match.input.substring(0, match.index),
            version : match[0]
        });
    }
    
    return retTargets;
}