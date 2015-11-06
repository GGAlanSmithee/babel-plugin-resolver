var createConfig = require('./src/index').createConfig;

createConfig('shared', ['ie11', 'node5', 'firefox42', 'chrome46']);
createConfig('ie11', ['ie11']);
createConfig('node5', ['node5']);
createConfig('firefox42', ['firefox42']);
createConfig('chrome46', ['chrome46']);