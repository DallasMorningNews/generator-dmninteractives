const _ = require('lodash');
const fs = require('fs');
const github = require('octonode');
const googleURL = require('google-url-helper');
const mkdirp = require('mkdirp');
const path = require('path');
const S = require('string');
const validURL = require('valid-url');
const yeoman = require('yeoman-generator');


const githubClient = github.client();


module.exports = yeoman.Base.extend({
  prompting() {
    const done = this.async();

    this.log('Starting up an INTERACTIVE PAGE with BROWSERIFY...');

    this.baseConfig = this.options.baseConfig;

    const prompts = [
      {
        name: 'directoryName',
        message: 'What\'s your directory name?',
      },
      {
        name: 'awsAccessKey',
        message: 'What\'s your AWS access key?',
      },
      {
        name: 'awsSecretKey',
        message: 'What\'s your AWS secret key?',
      },
      {
        name: 'hotCopyID',
        message: '[Optional] Enter the ID or URL of this page\'s Google Doc copy.',
      },
    ];

    this.prompt(prompts, (props) => {
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

      console.log(this);

      done();
    });
  },

  writing: {
    app() {
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('./package.json'),
        { appName: this.appName }  // eslint-disable-line comma-dangle
      );
    },

    gulpfiles() {
      this.fs.copy(
        this.templatePath('gulpfile.js'),
        this.destinationPath('./gulpfile.js')  // eslint-disable-line comma-dangle
      );

      this.fs.copy(
        this.templatePath('./gulp/**/*'),
        this.destinationPath('./gulp/')  // eslint-disable-line comma-dangle
      );
    },

    projectfiles() {
      // ---------------------------------------
      // Fetch remote template files from github
      // hosted in interactives_starterkit
      if (!_.isUndefined(this.baseConfig.filesFromRepos)) {
        _.each(this.baseConfig.filesFromRepos, (repoFiles, repoName) => {
          const repo = githubClient.repo(repoName);

          _.each(repoFiles, (file) => {
            const destFilePath = (
              _.has(file.dest, 'name')
            ) ? (
              path.join(file.dest.path, file.dest.name)
            ) : (
              path.join(file.dest.path, path.basename(file.source))
            );

            mkdirp(path.dirname(destFilePath));

            repo.contents(file.source, (error, contents) => {
              const fileContents = new Buffer(contents.content, 'base64');

              fs.writeFileSync(destFilePath, fileContents);
            });
          });
        });
      }

      // ---------------------------
      // Copy rest of template files

      this.fs.copy(
        this.templatePath('bundled-styles.scss'),
        // eslint-disable-next-line comma-dangle
        this.destinationPath('./src/static/scss/bundled-styles.scss')
      );

      this.fs.copy(
        this.templatePath('data.json'),
        // eslint-disable-next-line comma-dangle
        this.destinationPath('./src/static/js/data.json')
      );

      this.fs.copy(
        this.templatePath('img.html'),
        // eslint-disable-next-line comma-dangle
        this.destinationPath('./src/templates/partials/img.html')
      );

      this.fs.copy(
        this.templatePath('defaultImage.jpg'),
        // eslint-disable-next-line comma-dangle
        this.destinationPath('./src/static/images/_defaultImage.jpg')
      );

      this.fs.copy(
        this.templatePath('buttonLeft.svg'),
        // eslint-disable-next-line comma-dangle
        this.destinationPath('./src/static/images/buttonLeft.svg')
      );

      this.fs.copy(
        this.templatePath('buttonRight.svg'),
        // eslint-disable-next-line comma-dangle
        this.destinationPath('./src/static/images/buttonRight.svg')
      );

      this.fs.copy(
        this.templatePath('gitkeep'),
        // eslint-disable-next-line comma-dangle
        this.destinationPath('./src/static/vendor/.gitkeep')
      );

      // -------------------------
      // Create output directories
      mkdirp('./src/static/assets');
      mkdirp('./src/static/vendor');
      mkdirp('./src/misc');
      mkdirp('./dist');
    },

    aws() {
      const awsJson = {
        accessKeyId: this.awsAccessKey,
        secretAccessKey: this.awsSecretKey,
        params: {
          Bucket: 'interactives.dallasnews.com',
        },
      };

      this.fs.writeJSON('aws.json', awsJson);
    },

    meta() {
      const timestamp = new Date();
      // const defaultKeywords = [
      //   'interactives', 'dallas', 'dallas news', 'dfw news', 'dallas newspaper',
      //   'dallas morning news', 'dallas morning news newspaper',
      // ];
      const metaJson = {
        id: (Math.floor(Math.random() * 100000000000) + 1).toString(),
        name: this.directoryName,
        // pageTitle: '<Title>',
        // shareTitle: '<Title>',
        // shareText: '<Text>',
        // tweetText: '<Text>',
        publishYear: timestamp.getFullYear(),
        publishDate: `${
          timestamp.getFullYear()
        }-${
          timestamp.getMonth() + 1
        }-${
          timestamp.getDate()
        }T00:00:00Z`,
        url: `http://interactives.dallasnews.com/${timestamp.getFullYear()}/${this.directoryName}/`,
        // authors: '<Authors - comma-separated, capitalize first letter of names.
        // NOTE: If more than one author, you will need to manually edit the author
        // key in the parsely json object. Author names should be comma separated
        // strings within an array in the parsely json object.>',
        // desk: '<Desk>',
        // section: '<Section>',
        // keywords: defaultKeywords,
        imgURL: `http://interactives.dallasnews.com/${
          timestamp.getFullYear()
        }/${
          this.appName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
        }/${
          this.shareImage
        }`,
        imgWidth: '<Width - w/out "px">',
        imgHeight: '<Height - w/out "px">',
        // sectionTwitter: '<handle - w/out "@">',
        // authorTwitter: '<handle - w/out "@">'
      };
      this.fs.writeJSON('meta.json', metaJson);
    },

    git() {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('./.gitignore')  // eslint-disable-line comma-dangle
      );
    },
  },

  install() {
    this.installDependencies({
      bower: false,
      // eslint-disable-next-line comma-dangle
      callback: () => { this.emit('dependenciesInstalled'); }
    });

    this.on('dependenciesInstalled', () => {
      this.spawnCommand('gulp', ['img']);
      this.spawnCommand('gulp');
    });
  },

});
