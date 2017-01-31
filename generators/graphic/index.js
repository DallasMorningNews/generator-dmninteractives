'use strict';
var yeoman      = require('yeoman-generator'),
    mkdirp      = require('mkdirp'),
    fs          = require('fs'),
    S           = require('string');


module.exports = yeoman.Base.extend({
  prompting: function () {
    var done = this.async();

    this.log('Starting up an EMBEDDABLE GRAPHIC...');

    var prompts = [{
      name:'directoryName',
      message: 'What\'s your directory name?'
    },{
      name:'awsAccessKey',
      message: 'What\'s your AWS access key?'
    },{
      name:'awsSecretKey',
      message: 'What\'s your AWS secret key?'
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Pym.js',
        value: 'includePym',
        checked: true
      },{
        name: 'D3.js',
        value: 'includeD3',
        checked: false
      },{
        name: 'Leaflet.js',
        value: 'includeLeaflet',
        checked: false
      },{
        name: 'MapboxGL',
        value: 'includeMapbox',
        checked: false
      },{
        name: 'FontAwesome',
        value: 'includeFontAwesome',
        checked: false
      },{
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: false
      },{
        name: 'JQuery UI',
        value: 'includeJQUI',
        checked: false
      }]
    }];

    this.prompt(prompts, function (props) {

      var features = props.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.directoryName = S(props.directoryName).slugify().s;
      this.appName = S(props.directoryName).camelize().s;
      this.awsAccessKey = props.awsAccessKey;
      this.awsSecretKey = props.awsSecretKey;
      this.dependencies = {};
      this.dependencies.includePym = hasFeature('includePym');
      this.dependencies.includeD3 = hasFeature('includeD3');
      this.dependencies.includeLeaflet = hasFeature('includeLeaflet');
      this.dependencies.includeMapbox = hasFeature('includeMapbox');
      this.dependencies.includeFontAwesome = hasFeature('includeFontAwesome');
      this.dependencies.includeBootstrap = hasFeature('includeBootstrap');
      this.dependencies.includeJQUI = hasFeature('includeJQUI');

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('./package.json'),
        { appName: this.appName }
      );
      this.fs.copy(
        this.templatePath('gulpfile.js'),
        this.destinationPath('./gulpfile.js')
      );

    },

    projectfiles: function () {

      /////////////////////////////////////////////////
      // Fetch remote template files from github
      // hosted in interactives_starterkit

      // CSS & SCSS
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/css/theme.scss','./build/static/sass/', function(err){
        fs.rename('./build/static/sass/theme.scss','./build/static/sass/+base.scss');
      });
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/css/header.scss','./build/static/sass/', function(err){
        fs.rename('./build/static/sass/header.scss','./build/static/sass/+header.scss');
      });
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/css/footer.scss','./build/static/sass/', function(err){
        fs.rename('./build/static/sass/footer.scss','./build/static/sass/+footer.scss');
      });
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/css/_mixins.scss','./build/static/sass/', function(err){});
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/css/_variables.scss','./build/static/sass/', function(err){});
      // JS
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/js/customJS.js','./build/static/js/', function(err){
        fs.rename('./build/static/js/customJS.js','./build/static/js/+custom.js');
      });
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/js/furniture.js','./build/static/js/', function(err){
        fs.rename('./build/static/js/furniture.js','./build/static/js/+furniture.js');
      });

      ////////////////////////////////////
      // Copy rest of template files

      this.fs.copy(
        this.templatePath('index.html'),
        this.destinationPath('./build/templates/index.html')
      );
      this.fs.copy(
        this.templatePath('custom.scss'),
        this.destinationPath('./build/static/sass/+custom.scss')
      );
      this.fs.copy(
        this.templatePath('data.json'),
        this.destinationPath('./build/static/js/data.json')
      );

      if(this.dependencies.includeD3){
        this.fs.copy(
          this.templatePath('d3.js'),
          this.destinationPath('./build/static/js/+d3.js')
        );
      }
      if(this.dependencies.includeMapbox){
        this.fs.copy(
          this.templatePath('mapbox.js'),
          this.destinationPath('./build/static/js/+mapbox.js')
        );
      }

      ///////////////////////////////////
      // Create output directories
      mkdirp('./build/static/assets');
      mkdirp('./build/static/vendor');
      mkdirp('./build/misc');
      mkdirp('./public');
    },

    dependencies: function(){
      var bowerJson = {
        name: this.appName,
        private: true,
        dependencies: {}
      };

      if(this.dependencies.includePym){
        bowerJson.dependencies['pym.js'] = null;
      }
      if(this.dependencies.includeD3){
        bowerJson.dependencies['d3'] = null;
      }
      if(this.dependencies.includeLeaflet){
        bowerJson.dependencies['leaflet'] = null;
      }
      if(this.dependencies.includeMapbox){
        bowerJson.dependencies['mapbox-gl-js'] = null;
      }
      if(this.dependencies.includeFontAwesome){
        bowerJson.dependencies['fontawesome'] = null;
      }
      if(this.dependencies.includeBootstrap){
        bowerJson.dependencies['bootstrap'] = null;
      }
      if(this.dependencies.includeJQUI){
        bowerJson.dependencies['jquery-ui'] = null;
      }
      this.fs.writeJSON('bower.json', bowerJson);
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
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
        id: (Math.floor(Math.random() * 100000000000) + 1).toString(),
        name: this.directoryName,
        pageTitle: S(this.directoryName).humanize().s,
        publishYear: timestamp.getFullYear(),
        publishDate: timestamp.getFullYear() +'-'+(timestamp.getMonth()+1)+'-'+timestamp.getDate()+'T00:00:00Z',
        url: 'http://interactives.dallasnews.com/' + timestamp.getFullYear() +'/'+this.directoryName+'/'
      }
      this.fs.writeJSON('meta.json', metaJson);
    },

    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('./.gitignore')
      );
    },
  },

  install: function () {
    this.installDependencies({
      callback: function() {
        this.emit('dependenciesInstalled');
      }.bind(this)
    });

    this.on('dependenciesInstalled', function() {
        this.spawnCommand('gulp', ['img']);
        this.spawnCommand('gulp');
    });

  },

  subgen: function () {
      this.composeWith('dmninteractives:gulp');
  }

});
