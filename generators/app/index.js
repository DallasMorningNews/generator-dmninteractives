'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var wiredep = require('wiredep');
var camelCase = require('camel-case');


module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    this.log('    ____  __  ____   _____\n   / __ \\/  |/  / | / /   |  ____  ____  _____\n  / / / / /|_/ /  |/ / /| | / __ \\/ __ \\/ ___/\n / /_/ / /  / / /|  / ___ |/ /_/ / /_/ (__  )\n/_____/_/  /_/_/ |_/_/  |_/ .___/ .___/____/\n                         /_/   /_/            \n');

    var prompts = [{
      name:'appName',
      message: 'What\'s your project\'s name?'
    },{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'D3',
        value: 'includeD3',
        checked: false
      },{
        name: 'Leaflet',
        value: 'includeLeaflet',
        checked: false
      },{
        name: 'FontAwesome',
        value: 'includeFA',
        checked: false
      },{
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: false
      }]
    }];

    this.prompt(prompts, function (props) {

      var features = props.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      };

      this.appName = camelCase(props.appName);
      this.includeD3 = hasFeature('includeD3');
      this.includeLeaflet = hasFeature('includeLeaflet');
      this.includeFA = hasFeature('includeFA');
      this.includeBootstrap = hasFeature('includeBootstrap');

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      //App files
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('./package.json'),
        { appName: this.appName }
      );
      this.fs.copy(
        this.templatePath('_app.js'),
        this.destinationPath('./app.js')
      );
      this.fs.copy(
        this.templatePath('_gulpfile.js'),
        this.destinationPath('./gulpfile.js')
      );

    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('_theme.css'),
        this.destinationPath('./build/static/css/_base.css')
      );
      this.fs.copy(
        this.templatePath('_custom.scss'),
        this.destinationPath('./build/static/sass/custom.scss')
      );
      this.fs.copy(
        this.templatePath('_custom.sass'),
        this.destinationPath('./build/static/sass/custom.sass')
      );
      this.fs.copy(
        this.templatePath('_custom.js'),
        this.destinationPath('./build/static/js/custom.js')
      );
      this.fs.copy(
        this.templatePath('_data.json'),
        this.destinationPath('./build/static/js/data.json')
      );
      this.fs.copy(
        this.templatePath('_base.html'),
        this.destinationPath('./build/templates/base.html')
      );
      this.fs.copy(
        this.templatePath('_index.html'),
        this.destinationPath('./build/templates/index.html')
      );
      mkdirp('./public');
    },

    bower: function () {
      var bowerJson = {
        name: this.appName,
        private: true,
        dependencies: {}
      };

      if (this.includeD3) {
        bowerJson.dependencies['d3'] = '~3.5.6';
      }
      if (this.includeLeaflet) {
        bowerJson.dependencies['leaflet'] = '~1.0.0';
      }
      if (this.includeFA) {
        bowerJson.dependencies['fontawesome'] = '~4.4.0';
      }
      if (this.includeBootstrap) {
          bowerJson.dependencies['bootstrap'] = '~3.3.5';
          bowerJson.overrides = {
            'bootstrap': {
              'main': [
                'less/bootstrap.less',
                'dist/css/bootstrap.css',
                'dist/js/bootstrap.js',
                'dist/fonts/*'
              ]
            }
          };
      }

      this.fs.writeJSON('bower.json', bowerJson);
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },

    aws: function(){
      var awsJson = {
        accessKeyId: '<ACCESS KEY>',
        secretAccessKey: '<SECRET KEY>',
        params:{
            Bucket: 'interactives.dallasnews.com'
          }
        };
      this.fs.writeJSON('aws.json', awsJson);
    },

    meta: function(){
      var metaJson = {
        name: this.appName,
        publishYear: new Date().getFullYear()
      }
      this.fs.writeJSON('meta.json', metaJson);
    },

    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('./.gitignore'));

    },
  },

  install: function () {
    this.installDependencies({
      callback: function() {
                // Emit a new event - dependencies installed
                this.emit('dependenciesInstalled');
            }.bind(this)
    });



    this.on('dependenciesInstalled', function() {
      //inject dependencies
      var bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));
        wiredep({
          bowerJson: bowerJson,
          directory: 'public/static/vendor',
          ignorePath: /.+public/,
          src: 'build/templates/base.html',
          exclude: [ /jquery/,]
        });

        this.spawnCommand('gulp');
    });
  },

});
