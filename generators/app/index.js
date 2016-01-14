'use strict';
var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');
var camelCase = require('camel-case');
var fs = require('fs');

// Dependency CDN files
var optional_cdn = require('./optional_cdn.json');
var required_cdn = require('./required_cdn.json');


module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    this.log('    ____  __  ____   _____\n   / __ \\/  |/  / | / /   |  ____  ____  _____\n  / / / / /|_/ /  |/ / /| | / __ \\/ __ \\/ ___/\n / /_/ / /  / / /|  / ___ |/ /_/ / /_/ (__  )\n/_____/_/  /_/_/ |_/_/  |_/ .___/ .___/____/\n                         /_/   /_/            \n');

    var prompts = [{
      name:'appName',
      message: 'What\'s your directory name?'
    },{
      name:'awsAccessKey',
      message: 'What\'s your AWS access key?'
    },{
      name:'awsSecretKey',
      message: 'What\'s your AWS secret key?'
    },

    /* stuff I'm adding */
    {
      name: 'title',
      message: '(Metadata) What is the title of your interactive?'
    }, {
      name: 'description',
      message: '(Metadata) What is the description of your interactive?'
    }, {
      name: 'authors',
      message: '(Metadata) Who is/are the authors? (comma separated,no space)'
    }, {
      name: 'desk',
      message: '(Metadata) What desk does this interactive belong to? (news, business, entertainment, lifestyle, opinion, sports)'
    }, {
      name: 'section',
      message: '(Metadata) What section does this interactive belong to? (To see sections, go to dallasnews.com and hover over appropriate desk, sections with multiple words should be hyphen separated, ex: food-and-wine)'
    }, {
      name: 'keywords',
      message: '(Metadata) What are the keywords associated with this interactive? (comma separated, no space)'
    }, {
      name: 'shareImage',
      message: '(Metadata) What is the parent directory and name of the share image? (ex: images/share.jpg)'
    }, {
      name: 'shareImageWidth',
      message: '(Metadata) What is the width of your share image in pixels? (standard is 1200; use just the number, no unit of measure)'
    }, {
      name: 'shareImageHeight',
      message: '(Metadata) What is the height of your share image in pixels? (standard is 630; use just the number, no unit of measure)'
    }, {
      name: 'twitter',
      message: '(Metadata) What is the twitter handle for the section this interactive belongs to? (@dallasnews, @sportsdaydfw, @DMNbiz, @guidelive, @DMNopinion)'
    }, {
      name: 'authorTwitter',
      message: '(Metadata) What is the author\'s twitter handle? (include the @ symbol, comma separate if multiple)'
    },


    /* end stuff I'm adding */
    {
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
      }/*,{
        name: 'FontAwesome',
        value: 'includeFontAwesome',
        checked: false
      }*/,{
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
      this.title = props.title;
      this.description = props.description;
      this.authors = props.authors;
      this.desk = props.desk;
      this.section = props.section;
      this.keywords = props.keywords;
      this.shareImage = props.shareImage;
      this.shareImageWidth = props.shareImageWidth;
      this.shareImageHeight = props.shareImageHeight;
      this.twitter = props.twitter;
      this.authorTwitter = props.authorTwitter;
      this.dependencies = {};
      this.dependencies.includeJQUI = hasFeature('includeJQUI');
      this.dependencies.includeJQSwipe = hasFeature('includeJQSwipe');
      this.dependencies.includeBowser = hasFeature('includeBowser');
      this.dependencies.includeModernizr = hasFeature('includeModernizr');
      this.dependencies.includeD3 = hasFeature('includeD3');
      this.dependencies.includeLeaflet = hasFeature('includeLeaflet');
      /*this.dependencies.includeFontAwesome = hasFeature('includeFontAwesome');*/
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

      /////////////////////////////////////////////////
      // Fetch remote template files from github
      // hosted in interactives_starterkit
      
      // HTML
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/templates/base.html','./build/templates/',function(err){});
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/templates/index.html','./build/templates/',function(err){});
      // CSS & SCSS
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/css/theme.scss','./build/static/sass/',function(err){
        fs.rename('./build/static/sass/theme.scss','./build/static/sass/+base.scss');
      });
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/css/_mixins.scss','./build/static/sass/',function(err){});
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/css/_variables.scss','./build/static/sass/',function(err){});
      // JS
      this.fetch('https://raw.githubusercontent.com/DallasMorningNews/interactives_starterkit/master/js/customJS.js','./build/static/js/',function(err){
        fs.rename('./build/static/js/customJS.js','./build/static/js/+custom.js');
      });

      ////////////////////////////////////
      // Copy rest of template files

      this.fs.copy(
        this.templatePath('_custom.scss'),
        this.destinationPath('./build/static/sass/+custom.scss')
      );
      this.fs.copy(
        this.templatePath('_data.json'),
        this.destinationPath('./build/static/js/data.json')
      );
      this.fs.copy(
        this.templatePath('_img.html'),
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

      ///////////////////////////////////
      // Create output directories
      mkdirp('./build/static/assets');
      mkdirp('./preview');
      mkdirp('./publish');
    },

    /*
    // Working on this... 
    required_dependencies: function(){
      var dest = './build/static/vendor';
      for(var dependency in required_cdn){
        this.fetch(required_cdn[dependency], dest, function(err){});
      };
    },*/

    optional_dependencies: function(){
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
        dependencyFetch(this, optional_cdn.JQUI);
      }
      if(this.dependencies.includeJQSwipe){
        dependencyFetch(this, optional_cdn.JQSwipe);
      }
      if(this.dependencies.includeBowser){
        dependencyFetch(this, optional_cdn.Bowser);
      }
      if(this.dependencies.includeModernizr){
        dependencyFetch(this, optional_cdn.Modernizr);
      }
      if(this.dependencies.includeD3){
        dependencyFetch(this, optional_cdn.D3);
      }
      if(this.dependencies.includeLeaflet){
        dependencyFetch(this, optional_cdn.Leaflet);
      }
/*      if(this.dependencies.includeFontAwesome){
        dependencyFetch(this, optional_cdn.FontAwesome);
      }*/
      if(this.dependencies.includeBootstrap){
        dependencyFetch(this, optional_cdn.Bootstrap);
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
      var defaultKeywords = ["interactives","dallas","dallas news","dfw news","dallas newspaper","dallas morning news","dallas morning news newspaper"];
      var customKeywords = this.keywords.split(",");
      var metaJson = {
        name: this.projectName,
        title: this.title,
        publishYear: timestamp.getFullYear(),
        publishDate: timestamp.getFullYear() +"-"+(timestamp.getMonth()+1)+"-"+timestamp.getDate()+"T00:00:00Z",
        description: this.description,
        url: 'interactives.dallasnews.com/' + timestamp.getFullYear() +"/"+this.appName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()+"/",
        id: (Math.floor(Math.random() * 100000000000) + 1).toString() ,
        authors: this.authors,
        desk: this.desk,
        section: this.section,
        keywords: defaultKeywords.concat(customKeywords),
        imgURL: 'http://interactives.dallasnews.com/' + timestamp.getFullYear() +"/"+this.appName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()+"/" + this.shareImage,
        imgWidth: this.shareImageWidth,
        imgHeight: this.shareImageHeight,
        twitter: this.twitter,
        authorTwitter: this.authorTwitter
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
        this.spawnCommand('gulp', ['img']);
        this.spawnCommand('gulp');
    });

  },

});
