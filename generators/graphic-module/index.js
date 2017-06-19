'use strict';
var yeoman      = require('yeoman-generator'),
    mkdirp      = require('mkdirp'),
    fs          = require('fs'),
    S           = require('string');


module.exports = yeoman.Base.extend({
  initializing: function() {
    this.composeWith('dmninteractives:linters');
    this.composeWith('dmninteractives:common');
  },

  prompting: function () {
    var done = this.async();

    this.log('Starting up a GRAPHIC MODULE...');

    var prompts = [{
      name:'appName',
      message: 'What\'s your npm project name, e.g., "dmn-chart-scatterplot"?'
    },{
      name:'objName',
      message: 'What\'s the name of the chart class users will call, e.g., "TexasChoropleth"?'
    }];

    this.prompt(prompts, function (props) {

      var features = props.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.objName = S(props.objName).camelize().s;
      this.appName = props.appName;
      done();
    }.bind(this));
  },

  writing: {
    appFiles: function () {
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('./package.json'),
        { appName: this.appName }
      );
      this.fs.copyTpl(
        this.templatePath('README'),
        this.destinationPath('./README.md'),
        {
          appName: this.appName,
          objName: this.objName
        }
      );
      this.fs.copy(
        this.templatePath('gulpfile.js'),
        this.destinationPath('./gulpfile.js')
      );
      this.fs.copy(
        this.templatePath('preview.png'),
        this.destinationPath('./preview.png')
      );
    },

    srcFiles: function () {
      this.fs.copy(
        this.templatePath('src/js/chart.js'),
        this.destinationPath('./src/js/chart.js')
      );
      this.fs.copyTpl(
        this.templatePath('src/js/global-chart.js'),
        this.destinationPath('./src/js/global-chart.js'),
        { objName: this.objName }
      );
      this.fs.copyTpl(
        this.templatePath('src/scss/_variables.scss'),
        this.destinationPath('./src/scss/_variables.scss'),
        { objName: this.objName }
      );
      this.fs.copyTpl(
        this.templatePath('src/scss/_chart-styles.scss'),
        this.destinationPath('./src/scss/_chart-styles.scss'),
        { objName: this.objName }
      );
      this.fs.copyTpl(
        this.templatePath('src/scss/styles.scss'),
        this.destinationPath('./src/scss/styles.scss'),
        { objName: this.objName }
      );
    },

    gulpFiles: function () {
      this.fs.copy(
        this.templatePath('gulp/index.js'),
        this.destinationPath('./gulp/index.js')
      );
      this.fs.copy(
        this.templatePath('gulp/tasks/browserify.js'),
        this.destinationPath('./gulp/tasks/browserify.js')
      );
      this.fs.copy(
        this.templatePath('gulp/tasks/sass.js'),
        this.destinationPath('./gulp/tasks/sass.js')
      );
      this.fs.copy(
        this.templatePath('gulp/tasks/server.js'),
        this.destinationPath('./gulp/tasks/server.js')
      );
    },

    distFiles: function() {
      this.fs.copyTpl(
        this.templatePath('dist/index.html'),
        this.destinationPath('./dist/index.html'),
        { objName: this.objName }
      );
      this.fs.copy(
        this.templatePath('dist/data/create.json'),
        this.destinationPath('./dist/data/create.json')
      );
      this.fs.copy(
        this.templatePath('dist/data/update.json'),
        this.destinationPath('./dist/data/update.json')
      );
      mkdirp('./dist/css');
      mkdirp('./dist/js');
    }
  },

  install: function () {
    this.installDependencies({
      callback: function() {
        this.emit('dependenciesInstalled');
      }.bind(this)
    });

    this.on('dependenciesInstalled', function() {
        this.spawnCommand('gulp');
    });

  },

});
