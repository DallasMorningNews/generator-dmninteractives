'use strict';


var _ = require('underscore');
var fs = require('fs');
var github = require('octonode');
var googleURL = require('google-url-helper');
var mkdirp = require('mkdirp');
var path = require('path');
var S = require('string');
var validURL = require('valid-url');
var yeoman = require('yeoman-generator');


var githubClient = github.client();


module.exports = yeoman.Base.extend({
  prompting: function () {
    var done = this.async();

    this.log('Starting up an INTERACTIVE PAGE with BROWSERIFY...');

    this.baseConfig = this.options.baseConfig;

    var prompts = [
      {
        name:'directoryName',
        message: 'What\'s your directory name?'
      },
      {
        name:'awsAccessKey',
        message: 'What\'s your AWS access key?'
      },
      {
        name:'awsSecretKey',
        message: 'What\'s your AWS secret key?'
      },
      {
        name:'hotCopyID',
        message: '[Optional] Enter the ID or URL of this page\'s Google Doc copy.'
      }
    ];

    this.prompt(prompts, function (props) {
      this.directoryName = S(props.directoryName).slugify().s;
      this.appName = S(props.directoryName).camelize().s;
      this.awsAccessKey = props.awsAccessKey;
      this.awsSecretKey = props.awsSecretKey;

      if (props.hotCopyID === '') {
        this.hotCopyID = null;
      } else {
        this.hotCopyID = (
          validURL.isUri(props.hotCopyID)
        ) ? (
          googleURL.parseId(props.hotCopyID)
        ) : (
          props.hotCopyID
        );
      }

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
      if (!_.isUndefined(this.baseConfig.filesFromRepos)) {
        _.each(this.baseConfig.filesFromRepos, function(repoFiles, repoName) {
          var repo = githubClient.repo(repoName);

          _.each(repoFiles, function(file) {
            var destFilePath = (
              _.has(file.dest, 'name')
            ) ? (
              path.join(file.dest.path, file.dest.name)
            ) : (
              path.join(file.dest.path, path.basename(file.source))
            );

            mkdirp(path.dirname(destFilePath));

            repo.contents(file.source, function(error, contents) {
              var fileContents = new Buffer(contents.content, 'base64');

              fs.writeFileSync(destFilePath, fileContents);
            });
          });
        });
      }

      ////////////////////////////////////
      // Copy rest of template files

      this.fs.copy(
        this.templatePath('bundled-styles.scss'),
        this.destinationPath('./build/static/sass/bundled-styles.scss')
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
      // var defaultKeywords = ['interactives','dallas','dallas news','dfw news','dallas newspaper','dallas morning news','dallas morning news newspaper'];
      var metaJson = {
        id: (Math.floor(Math.random() * 100000000000) + 1).toString(),
        name: this.directoryName,
        // pageTitle: '<Title>',
        // shareTitle: '<Title>',
        // shareText: '<Text>',
        // tweetText: '<Text>',
        publishYear: timestamp.getFullYear(),
        publishDate: timestamp.getFullYear() +'-'+(timestamp.getMonth()+1)+'-'+timestamp.getDate()+'T00:00:00Z',
        url: 'http://interactives.dallasnews.com/' + timestamp.getFullYear() +'/'+this.directoryName+'/',
        // authors: '<Authors - comma-separated, capitalize first letter of names. NOTE: If more than one author, you will need to manually edit the author key in the parsely json object. Author names should be comma separated strings within an array in the parsely json object.>',
        // desk: '<Desk>',
        // section: '<Section>',
        // keywords: defaultKeywords,
        imgURL: 'http://interactives.dallasnews.com/' + timestamp.getFullYear() +'/'+this.appName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()+'/'+ this.shareImage,
        imgWidth: '<Width - w/out "px">',
        imgHeight: '<Height - w/out "px">',
        // sectionTwitter: '<handle - w/out "@">',
        // authorTwitter: '<handle - w/out "@">'
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
      bower: false,
      callback: function() {
        this.emit('dependenciesInstalled');
      }.bind(this)
    });

    this.on('dependenciesInstalled', function() {
        this.spawnCommand('gulp', ['img']);
        this.spawnCommand('gulp');
    });
  },

});
