'use strict';
var yeoman      = require('yeoman-generator'),
    mkdirp      = require('mkdirp'),
    fs          = require('fs'),
    S           = require('string');


module.exports = yeoman.Base.extend({
  prompting: function () {
    var done = this.async();

    this.log('Starting up an INTERACTIVE PAGE...');

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
        name: 'JQuery UI',
        value: 'includeJQUI',
        checked: false
      },{
        name: 'JQuery TouchSwipe',
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
        name: 'Bootstrap',
        value: 'includeBootstrap',
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
      this.dependencies.includeJQUI = hasFeature('includeJQUI');
      this.dependencies.includeJQSwipe = hasFeature('includeJQSwipe');
      this.dependencies.includeBowser = hasFeature('includeBowser');
      this.dependencies.includeModernizr = hasFeature('includeModernizr');
      this.dependencies.includeD3 = hasFeature('includeD3');
      this.dependencies.includeBootstrap = hasFeature('includeBootstrap');

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

      // HTML
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/templates/base.html','./build/templates/', function(err){});
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/templates/index.html','./build/templates/', function(err){});
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/templates/adblock1.html','./build/templates/', function(err){});
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/templates/adblock2.html','./build/templates/', function(err){});
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/templates/adblock3.html','./build/templates/', function(err){});
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
        this.templatePath('custom.scss'),
        this.destinationPath('./build/static/sass/+custom.scss')
      );
      this.fs.copy(
        this.templatePath('data.json'),
        this.destinationPath('./build/static/js/data.json')
      );
      this.fs.copy(
        this.templatePath('img.html'),
        this.destinationPath('./build/templates/partials/img.html')
      );
      this.fs.copy(
        this.templatePath('defaultImage.jpg'),
        this.destinationPath('./build/static/images/_defaultImage.jpg')
      );
      this.fs.copy(
        this.templatePath('buttonLeft.svg'),
        this.destinationPath('./build/static/images/buttonLeft.svg')
      );
      this.fs.copy(
        this.templatePath('buttonRight.svg'),
        this.destinationPath('./build/static/images/buttonRight.svg')
      );
      this.fs.copy(
        this.templatePath('gitkeep'),
        this.destinationPath('./build/static/vendor/.gitkeep')
      );

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

      if(this.dependencies.includeJQUI){
        bowerJson.dependencies['jquery-ui'] = null;
      }
      if(this.dependencies.includeJQSwipe){
        bowerJson.dependencies['jquery-touchswipe'] = null;
      }
      if(this.dependencies.includeBowser){
        bowerJson.dependencies['bowser'] = 'ded/bowser#^1.0.0';
      }
      if(this.dependencies.includeModernizr){
        bowerJson.dependencies['modernizr-min'] = null;
      }
      if(this.dependencies.includeD3){
        bowerJson.dependencies['d3'] = null;
      }
      if(this.dependencies.includeBootstrap){
        bowerJson.dependencies['bootstrap'] = null;
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
      var defaultKeywords = ['interactives','dallas','dallas news','dfw news','dallas newspaper','dallas morning news','dallas morning news newspaper'];
      var metaJson = {
        id: (Math.floor(Math.random() * 100000000000) + 1).toString(),
        name: this.directoryName,
        pageTitle: '<Title>',
        shareTitle: '<Title>',
        shareText: '<Text>',
        tweetText: '<Text>',
        publishYear: timestamp.getFullYear(),
        publishDate: timestamp.getFullYear() +'-'+(timestamp.getMonth()+1)+'-'+timestamp.getDate()+'T00:00:00Z',
        url: 'http://interactives.dallasnews.com/' + timestamp.getFullYear() +'/'+this.directoryName+'/',
        authors: '<Authors - comma-separated, capitalize first letter of names. NOTE: If more than one author, you will need to manually edit the author key in the parsely json object. Author names should be comma separated strings within an array in the parsely json object.>',
        desk: '<Desk>',
        section: '<Section>',
        keywords: defaultKeywords,
        imgURL: 'http://interactives.dallasnews.com/' + timestamp.getFullYear() +'/'+this.appName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()+'/'+ this.shareImage,
        imgWidth: '<Width - w/out "px">',
        imgHeight: '<Height - w/out "px">',
        sectionTwitter: '<handle - w/out "@">',
        authorTwitter: '<handle - w/out "@">',
        authorFBProfile: '<Url for author FB profile. Leave empty string if none'
      };
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
  },

});
