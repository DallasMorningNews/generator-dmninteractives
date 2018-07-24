const _ = require('lodash');
const camelize = require('underscore.string/camelize');
const chalk = require('chalk');
const fs = require('fs');
const github = require('octonode');
const googleURL = require('google-url-helper');
const mkdirp = require('mkdirp');
const path = require('path');
const slugify = require('underscore.string/slugify');
const validURL = require('valid-url');
const yeoman = require('yeoman-generator');


const githubClient = github.client();


module.exports = yeoman.Base.extend({
  initializing() {
    this.composeWith('dmninteractives:linters');
    this.composeWith('dmninteractives:common');
  },

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
      this.directoryName = slugify(props.directoryName);
      this.appName = camelize(props.directoryName);
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
        this.templatePath('styles.scss'),
        // eslint-disable-next-line comma-dangle
        this.destinationPath('./src/scss/styles.scss')
      );

      this.fs.copy(
        this.templatePath('data.json'),
        // eslint-disable-next-line comma-dangle
        this.destinationPath('./src/data/data.json')
      );

      this.fs.copy(
        this.templatePath('img.html'),
        // eslint-disable-next-line comma-dangle
        this.destinationPath('./src/templates/partials/img.html')
      );

      this.fs.copy(
        this.templatePath('defaultImage.jpg'),
        // eslint-disable-next-line comma-dangle
        this.destinationPath('./src/images/_defaultImage.jpg')
      );

      this.fs.copy(
        this.templatePath('buttonLeft.svg'),
        // eslint-disable-next-line comma-dangle
        this.destinationPath('./src/images/buttonLeft.svg')
      );

      this.fs.copy(
        this.templatePath('buttonRight.svg'),
        // eslint-disable-next-line comma-dangle
        this.destinationPath('./src/images/buttonRight.svg')
      );

      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('./README.md'),
        // eslint-disable-next-line comma-dangle
        { slug: this.directoryName, year: (new Date()).getFullYear() }
      );

      // -------------------------
      // Create output directories
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
      const rawMonth = (timestamp.getMonth() + 1).toString();
      const rawDate = timestamp.getDate().toString();

      const month = rawMonth.length === 1 ? `0${rawMonth}` : rawMonth;
      const date = rawDate.length === 1 ? `0${rawDate}` : rawDate;

      const defaultKeywords = [
        'interactives', 'dallas', 'dallas news', 'dfw news', 'dallas newspaper',
        'dallas morning news', 'dallas morning news newspaper',
      ];  // Archie-able
      const metaJson = {
        id: (Math.floor(Math.random() * 100000000000) + 1).toString(),
        name: this.directoryName,
        pageTitle: '<Title>',  // Archie-able
        shareTitle: '<Title>',  // Archie-able
        shareText: '<Text>',  // Archie-able
        tweetText: '<Text>',  // Archie-able
        publishYear: timestamp.getFullYear(),
        publishDate: `${
          timestamp.getFullYear()
        }-${
          month
        }-${
          date
        }T00:00:00Z`,
        url: `https://interactives.dallasnews.com/${timestamp.getFullYear()}/${this.directoryName}/`,
        authors: ['<Author1>', '<Author2>'],  // Archie-able
        desk: '<Desk>',  // Archie-able
        section: '<Section>',  // Archie-able
        keywords: defaultKeywords,  // Archie-able
        imgURL: `https://interactives.dallasnews.com/${
          timestamp.getFullYear()
        }/${
          this.appName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
        }/${
          this.shareImage
        }`,
        imgWidth: '<Width - w/out "px">',
        imgHeight: '<Height - w/out "px">',
        sectionTwitter: '<handle - w/out "@">',  // Archie-able
        authorTwitter: '<handle - w/out "@">',  // Archie-able
        authorFBProfile: '<Url for author FB profile. Leave empty string if none>',
      };
      this.fs.writeJSON('meta.json', metaJson);
    },
  },

  install() {
    this.installDependencies({
      bower: false,
      // eslint-disable-next-line comma-dangle
      callback: () => { this.emit('dependenciesInstalled'); }
    });

    // this.on('dependenciesInstalled', () => {
    //   this.spawnCommand('gulp', ['img']);
    //   this.spawnCommand('gulp');
    // });
  },

  end() {
    const done = this.async();
    const imageProcess = this.spawnCommand('gulp', ['img']);

    imageProcess.on('close', () => {
      const buildProcess = this.spawnCommand('gulp', ['build']);

      buildProcess.on('close', () => {
        this.log(`\n${chalk.bold('Done!')}`);
        this.log(` See the generated ${chalk.yellow('README.md')} for usage info.`);
        this.log(` Run ${chalk.magenta('gulp')} to start developing.\n`);

        done();
      });
    });
  },

});
