/**
 * Mix this into your generator by adding a composeWith('linters') to your
 * generator's initializing() method to add ESLint configuration
 */

const yeoman = require('yeoman-generator');
const chalk = require('chalk');


module.exports = yeoman.Base.extend({
  CHOICE_AIRBNB: 'airbnb',
  CHOICE_ES6_RECOMMENDED: 'es6-recommended',
  CHOICE_NO_ESLINT: 'none',

  prompting() {
    const done = this.async();

    const prompts = [{
      type: 'list',
      name: 'lintProfile',
      choices: [{
        value: this.CHOICE_AIRBNB,
        name: `${chalk.bold('eslint-config-airbnb')} [strict enforcement of ES2015]`,
      }, {
        value: this.CHOICE_ES6_RECOMMENDED,
        name: `${chalk.bold('es6-recommended')} [encourages ES2015 syntax, but more forgiving]`,
      }, {
        value: this.CHOICE_NO_ESLINT,
        name: `${chalk.bold('No ESLint')} [skips ESLint installation altogether]`,
      }],
      message: 'Would you like to add an ESLint configuration?',
      store: true,
      default: 0,
    }];

    this.prompt(prompts, (answers) => {
      this.lintProfile = answers.lintProfile;
      done();
    });
  },

  writing() {
    if (this.lintProfile === this.CHOICE_NO_ESLINT) return;

    const esLintConfig = {
      root: true,
      parser: 'babel-env',
      rules: {
        'no-console': 0,
      },
      env: {
        browser: true,
      },
    };

    switch (this.lintProfile) {
      case (this.CHOICE_AIRBNB):
        Object.assign(esLintConfig, {
          extends: 'airbnb',
        });
        break;
      case (this.CHOICE_ES6_RECOMMENDED):
        Object.assign(esLintConfig, {
          extends: 'eslint:recommended',
          plugins: ['es6-recommended'],
        });
        break;
      default:
    }

    this.fs.writeJSON('./src/.eslintrc.json', esLintConfig);
  },

  install() {
    if (this.lintProfile === this.CHOICE_NO_ESLINT) return;

    const npmDeps = [
      'eslint@3',
      'babel-eslint',
    ];

    switch (this.lintProfile) {
      case this.CHOICE_AIRBNB:
        npmDeps.push(
          'eslint-plugin-import@^2.6',
          'eslint-plugin-react@^7.1',
          'eslint-plugin-jsx-a11y@^5.1',
          'eslint-config-airbnb@^15.0');
        break;
      case this.CHOICE_ES6_RECOMMENDED:
        npmDeps.push('eslint-plugin-es6-recommended');
        break;
      default:
    }

    this.npmInstall(npmDeps, { 'save-dev': true });
  },
});
