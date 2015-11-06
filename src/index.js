var fs = require('fs');
var tests = require('./../compat-table/data-es6').tests;
var featuresMap = require('./featuresmap').featuresMap;

exports.createConfig = function(targets) {
    targets = buildTargets(targets);
    
    var unsupportedFeatures = [];
    
    for (var target of targets) {
        for (var test of tests) {
            if (unsupportedFeatures[test.name]) {
                continue;
            }
            
            var wasFound = false;
            var fullySupportedInVersion = 0;
            
            if (test.subtests) {
                for (var subtest of test.subtests) {
                    var subWasFound = false;
                    var subFullySupportedInVersion = 0;
                    
                    Object.keys(subtest.res).some(function(k) {
                        if (subtest.res[k] === true) {
                            if (~k.indexOf(target.name)) {
                                var version = parseInt(k.substring(k.length-2, k.length), 10);
                                
                                if (subFullySupportedInVersion <= version) {
                                    subFullySupportedInVersion = version;
                                }
                                
                                if (fullySupportedInVersion <= version) {
                                    fullySupportedInVersion = version;
                                }
                                
                                subWasFound = true;
                                wasFound = true;
                            } else if (target.name === 'edge' && ~k.indexOf('ie')) { // if in ie, it's also in edge
                                fullySupportedInVersion = subFullySupportedInVersion = 12;
                                
                                subWasFound = true;
                                wasFound = true;
                            }
                        }
                    });
                    
                    if ((subtest.name === 'computed properties' || subtest.name ===  'shorthand properties') &&
                        (!subWasFound || subFullySupportedInVersion > target.version)) {
                        unsupportedFeatures.push(subtest.name);
                    }
                }
            } else {
                Object.keys(test.res).some(function(k) {
                    if (test.res[k] === true) {
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

        if (babelPlugin instanceof Array) {
            for (var plugin of babelPlugin) {
                if (plugin !== null && requiredBabelPlugins.indexOf(plugin) === -1) {
                    requiredBabelPlugins.push(plugin);
                }    
            }
        } else {
            if (babelPlugin !== null && requiredBabelPlugins.indexOf(babelPlugin) === -1) {
                requiredBabelPlugins.push(babelPlugin);
            }
        }
    }
    
    writeConfig(requiredBabelPlugins);
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

function writeConfig(requiredBabelPlugins) {
    var str = '{\n';
    str += '  plugins = [';
    
    for (var i in requiredBabelPlugins) {
        var plugin = requiredBabelPlugins[i];
        
        str += '"' + plugin + '"';
        
        if (i < requiredBabelPlugins.length - 1) {
           str += ', ' ;
        }
    }
    
    str += ' ]\n';
    str += '}';
                
    fs.writeFile('.babelrc', str, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log('Config generated!');
    });
}