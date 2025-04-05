const path = require('path');

module.exports = function override(config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
  };
  config.resolve.extensions = [
    ...config.resolve.extensions,
    '.js',   // Explicitly resolve .js files
    '.mjs',  // Explicitly resolve .mjs files (for ECMAScript Modules)
  ];
  return config;
};
