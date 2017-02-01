'use strict';

const path = require('path');

const chalk = require('chalk');
const S = require('string');
const yeoman = require('yeoman-generator');

const STARTERKIT = 'https://raw.githubusercontent.com/DallasMorningNews/' +
                   'interactives_starterkit/master/';


module.exports = yeoman.Base.extend({
  initializing() {
    this.composeWith('dmninteractives:linters');
  },

  prompting() {
    const done = this.async();

    this.log(
      'Starting up an "Embeddable Graphic". See the generated README.md file for usage info.');

    const prompts = [{
      type: 'input',
      name: 'slug',
      message: 'What\'s your graphics\'s slug?',
      default: process.cwd().split(path.sep).pop(),
      filter: (answer) => S(answer).slugify().s,
    }, {
      type: 'checkbox',
      message: 'Which fonts would you like to include?',
      name: 'fonts',
      choices: [{
        name: 'PT Serif',
        value: 'https://fonts.googleapis.com/css?family=PT+Serif:400,400italic,700,700italic',
      }, {
        name: 'Gotham',
        value: 'https://cloud.typography.com/6922714/7642152/css/fonts.css',
        checked: true,
      }, {
        name: 'FontAwesome',
        value: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
      }],
    }, {
      type: 'input',
      name:'year',
      message: 'What year will this graphic publish?',
      default: () => (new Date()).getFullYear(),
    }, {
      type: 'input',
      name:'awsAccessKey',
      message: 'What\'s your AWS access key?',
      store: true
    }, {
      type: 'input',
      name:'awsSecretKey',
      message: 'What\'s your AWS secret key?',
      store: true
    }];

    this.prompt(prompts, (answers) => {
      this._prompts = answers;
      this._prompts.projectName = `embed_${answers.slug}`;

      done();
    });
  },

  writing: {
    app() {
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('./package.json'),
        { appName: this._prompts.projectName }
      );

      this.fs.copy(
        this.templatePath('gulpfile.js'),
        this.destinationPath('./gulpfile.js')
      );

      this.fs.copy(
        this.templatePath('gulp/**/*.js'),
        this.destinationPath('./gulp/')
      );
    },

    projectfiles() {
      const done = this.async();

      // SCSS
      this.fetch(`${STARTERKIT}css/_mixins.scss`, './src/sass/', () => {
        this.fetch(`${STARTERKIT}css/_variables.scss`, './src/sass/', done);
      });

      this.fs.copy(
        this.templatePath('src/sass/styles.scss'),
        this.destinationPath('./src/sass/styles.scss')
      );

      // JavaScript
      this.fs.copy(
        this.templatePath('src/js/scripts.js'),
        this.destinationPath('./src/js/scripts.js')
      );

      // HTML
      this.fs.copyTpl(
        this.templatePath('dist/index.html'),
        this.destinationPath('./dist/index.html'),
        { fonts: this._prompts.fonts, }
      );
      this.fs.copyTpl(
        this.templatePath('dist/embed.html'),
        this.destinationPath('./dist/embed.html'),
        { slug: this._prompts.slug, fonts: this._prompts.fonts, }
      );
    },

    aws() {
      const awsJson = {
        accessKeyId: this._prompts.awsAccessKey,
        secretAccessKey: this._prompts.awsSecretKey,
        params:{
          Bucket: 'interactives.dallasnews.com'
        }
      };

      this.fs.writeJSON('aws.json', awsJson);
    },

    meta() {
      const metaJson = {
        name: this._prompts.slug,
        publishYear: this._prompts.year,
      };
      this.fs.writeJSON('meta.json', metaJson);
    },

    git() {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('./.gitignore')
      );

      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('./README.md'),
        { slug: this._prompts.slug, year: this._prompts.year, }
      );
    },
  },

  install() {
    this.installDependencies({ bower: false });
  },

  end() {
    const done = this.async();
    const buildProcess = this.spawnCommand('gulp', ['build']);

    buildProcess.on('close', () => {
      this.log(`\n${chalk.bold('Done!')}`);
      this.log(` See the generated ${chalk.yellow('README.md')} for usage info.`);
      this.log(` Run ${chalk.magenta('gulp')} to start developing.\n`);

      done();
    });
  },

});
