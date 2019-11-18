const path = require('path');

const chalk = require('chalk');
const slugify = require('underscore.string/slugify');
const yeoman = require('yeoman-generator');

const STARTERKIT = 'https://raw.githubusercontent.com/DallasMorningNews/' +
                   'interactives_starterkit/master/';


module.exports = yeoman.Base.extend({
  initializing() {
    this.composeWith('dmninteractives:linters');
    this.composeWith('dmninteractives:common');
    this.composeWith('dmninteractives:nvm');
    this.composeWith('dmninteractives:gitsecrets');
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
      filter: answer => slugify(answer),
    }, {
      type: 'checkbox',
      message: 'Which fonts would you like to include?',
      name: 'fonts',
      choices: [{
        name: 'PT Serif',
        value: 'https://fonts.googleapis.com/css?family=PT+Serif:400,400italic,700,700italic',
      }, {
        name: 'Montserrat',
        value: 'https://fonts.googleapis.com/css?family=Montserrat:400,700',
        checked: true,
      }, {
        name: 'FontAwesome',
        value: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
      }],
    }, {
      type: 'input',
      name: 'year',
      message: 'What year will this graphic publish?',
      default: () => (new Date()).getFullYear(),
    }, {
      type: 'input',
      name: 'awsAccessKey',
      message: 'What\'s your AWS access key?',
      store: true,
    }, {
      type: 'input',
      name: 'awsSecretKey',
      message: 'What\'s your AWS secret key?',
      store: true,
    }];

    this.prompt(prompts, (answers) => {
      this.prefs = answers;
      this.prefs.projectName = `embed_${answers.slug}`;

      done();
    });
  },

  writing: {
    app() {
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('./package.json'),
        { appName: this.prefs.projectName });

      this.fs.copy(
        this.templatePath('gulpfile.js'),
        this.destinationPath('./gulpfile.js'));

      this.fs.copy(
        this.templatePath('gulp/**/*.js'),
        this.destinationPath('./gulp/'));
    },

    projectfiles() {
      const done = this.async();

      // SCSS
      this.fetch(`${STARTERKIT}css/_mixins.scss`, './src/sass/', () => {
        this.fetch(`${STARTERKIT}css/_variables.scss`, './src/sass/', done);
      });

      this.fs.copy(
        this.templatePath('src/sass/**.scss'),
        this.destinationPath('./src/sass/'));

      // JavaScript
      this.fs.copy(
        this.templatePath('src/js/scripts.js'),
        this.destinationPath('./src/js/scripts.js'));

      // HTML
      this.fs.copyTpl(
        this.templatePath('src/index.html'),
        this.destinationPath('./src/index.html'),
        { fonts: this.prefs.fonts });
      this.fs.copyTpl(
        this.templatePath('src/embed.html'),
        this.destinationPath('./src/embed.html'),
        { slug: this.prefs.slug, fonts: this.prefs.fonts });
    },

    aws() {
      const awsJson = {
        accessKeyId: this.prefs.awsAccessKey,
        secretAccessKey: this.prefs.awsSecretKey,
        params: {
          Bucket: 'interactives.dallasnews.com',
        },
      };

      this.fs.writeJSON('aws.json', awsJson);
    },

    meta() {
      const metaJson = {
        name: this.prefs.slug,
        publishYear: this.prefs.year,
      };
      this.fs.writeJSON('meta.json', metaJson);
    },

    git() {
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('./README.md'),
        { slug: this.prefs.slug, year: this.prefs.year });
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
