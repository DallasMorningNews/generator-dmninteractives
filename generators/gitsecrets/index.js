/**
 * Mix this into your generator by adding a composeWith('gitsecrets') to your
 * generator's initializing() method to add optional run of `git init` and
 * secrets protection with git-secrets
 */
const chalk = require('chalk');
const yeoman = require('yeoman-generator');


module.exports = yeoman.Base.extend({
  prompting() {
    const done = this.async();

    this.prompt([{
      type: 'confirm',
      name: 'doit',
      message: 'Would you like to try to prevent AWS credentials from being committed to this project\'s git repository (we\'ll create a new repo if one doesn\'t exist)?',
    }], (props) => {
      this.doit = props.doit;
      done();
    });
  },

  writing() {
    this.failed = false;

    if (!this.doit) {
      return;
    }

    const done = this.async();

    this.spawnCommand('git', ['init', '--quiet']).on('close', () => {
      this.spawnCommand('git', ['secrets', '--install']).on('close', (installCode) => {
        if (installCode !== 0) {
          this.failed = true;
          done();
          return;
        }

        this.spawnCommand('git', ['secrets', '--register-aws']).on('close', (awsInstallCode) => {
          if (awsInstallCode !== 0) {
            this.failed = true;
          }
        });

        done();
      });
    });
  },

  end() {
    if (this.failed === true) {
      this.log(`${chalk.bold(chalk.red('Enabling AWS secrets protection failed.'))}`);
      this.log(` (1) Ensure you have git-secrets installed on your computer by running with ${chalk.magenta('brew install git-secrets')}.`);
      this.log(` (2) Then run ${chalk.magenta('git secrets --install && git secrets --register-aws')} to manually protect this repo.`);
    }
  },
});
