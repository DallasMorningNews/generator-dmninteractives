'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var wiredep = require('wiredep');
var camelCase = require('camel-case');

// Dependency opts cdn ref
var cdn = require('./cdn.json');


module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    this.log('    ____  __  ____   _____\n   / __ \\/  |/  / | / /   |  ____  ____  _____\n  / / / / /|_/ /  |/ / /| | / __ \\/ __ \\/ ___/\n / /_/ / /  / / /|  / ___ |/ /_/ / /_/ (__  )\n/_____/_/  /_/_/ |_/_/  |_/ .___/ .___/____/\n                         /_/   /_/            \n');

    var prompts = [{
      name:'appName',
      message: 'What\'s your project\'s name?'
    },{
      name:'awsAccessKey',
      message: 'What\'s your AWS access key?'
    },{
      name:'awsSecretKey',
      message: 'What\'s your AWS secret key?'
    },{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'JQuery UI',
        value: 'includeJQUI',
        checked: false
      },{
        name: 'JQuery Swipe',
        value: 'includeJQSwipe',
        checked: false
      },{
        name: 'Bowser',
        value: 'includeBowser',
        checked: false
      },{
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: false
      },{
        name: 'D3.js',
        value: 'includeD3',
        checked: false
      },{
        name: 'Leaflet.js',
        value: 'includeLeaflet',
        checked: false
      },{
        name: 'FontAwesome',
        value: 'includeFontAwesome',
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

      this.projectName = props.appName;
      this.appName = camelCase(props.appName);
      this.awsAccessKey = props.awsAccessKey;
      this.awsSecretKey = props.awsSecretKey;
      this.dependencies = {};
      this.dependencies.includeJQUI = hasFeature('includeJQUI');
      this.dependencies.includeJQSwipe = hasFeature('includeJQSwipe');
      this.dependencies.includeBowser = hasFeature('includeBowser');
      this.dependencies.includeModernizr = hasFeature('includeModernizr');
      this.dependencies.includeD3 = hasFeature('includeD3');
      this.dependencies.includeLeaflet = hasFeature('includeLeaflet');
      this.dependencies.includeFontAwesome = hasFeature('includeFontAwesome');
      this.dependencies.includeBootstrap = hasFeature('includeBootstrap');

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
      mkdirp('./build/static/img');
      mkdirp('./public');
    },

    dependencies: function(){

      // Pass a single url or an array to yeoman's fetch.
      var dependencyFetch = function(generator, dependency){
            var dest = './build/static/vendor';
            if(Array.isArray(dependency)){
              for(var i in dependency){
                generator.fetch(dependency[i], dest, function(err){});
              };
            }else{
              generator.fetch(dependency, dest, function(err){});
            }
          };

      if(this.dependencies.includeJQUI){
        dependencyFetch(this, cdn.JQUI);
      }
      if(this.dependencies.includeJQSwipe){
        dependencyFetch(this, cdn.JQSwipe);
      }
      if(this.dependencies.includeBowser){
        dependencyFetch(this, cdn.Bowser);
      }
      if(this.dependencies.includeModernizr){
        dependencyFetch(this, cdn.Modernizr);
      }
      if(this.dependencies.includeD3){
        dependencyFetch(this, cdn.D3);
      }
      if(this.dependencies.includeLeaflet){
        dependencyFetch(this, cdn.Leaflet);
      }
      if(this.dependencies.includeFontAwesome){
        dependencyFetch(this, cdn.FontAwesome);
      }
      if(this.dependencies.includeBootstrap){
        dependencyFetch(this, cdn.Bootstrap);
      }    
    },


    aws: function(){
      var awsJson = {
        accessKeyId: this.awsAccessKey,
        secretAccessKey: this.awsSecretKey,
        params:{
            Bucket: 'interactives.dallasnews.com'
          }
        };
      this.fs.writeJSON('aws.json', awsJson);
    },

    meta: function(){
      var timestamp = new Date();
      var metaJson = {
        name: this.projectName,
        publishYear: timestamp.getFullYear(),
        publishDate: timestamp.getFullYear() +"-"+(timestamp.getMonth()+1)+"-"+timestamp.getDate()+"T00:00:00Z",
        description: '<Project description>',
        url: 'interactives.dallasnews.com/' + timestamp.getFullYear() +"/"+this.appName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()+"/",
        id: (Math.floor(Math.random() * 100000000000) + 1).toString() ,
        authors: '<Project authors>',
        authorsFbook: '<Project authors\' facebook links>',
        desk: '<e.g., entertainment>',
        section: '<e.g., books>',
        keywords: ["interactives","dallas","dallas news","dfw news","dallas newspaper","dallas morning news","dallas morning news newspaper"],
        imgURL: '<Preview image url>',
        imgWidth: '<Preview image width>',
        imgHeight: '<Preview image height>',
        twitter: 'dallasnews',
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
        this.spawnCommand('gulp');
    });

  },

});
