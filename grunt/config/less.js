module.exports = function(config, lessConfig, pathConfig) {
  'use strict';

  var file = {};
  file[pathConfig.buildTarget+'/styles/styles.css'] = pathConfig.sourceDir+'/styles/styles.less';

  lessConfig[pathConfig.appName + '_styles'] = {
    options: {
      paths: [
        'styles',
        'scripts'
      ],


      dumpLineNumbers: '<%= buildTarget === "dist" ? "" : "comments" %>',
      compress: '<%= buildTarget === "dist" ? "true" : "" %>',
      sourceMap: '<%= buildTarget === "dist" ? "true" : "" %>',

      sourceMapURL: './styles.css.map',
      sourceMapFilename: pathConfig.buildTarget+'/styles/styles.css.map'
    },
    files: file
  };

};
