const fs = require('fs');
const os = require('os');
const path = require('path');
const process = require('process');

const chalk = require('chalk');
const mkdirp = require('mkdirp');
const S3 = require('aws-sdk/clients/s3');
const yeoman = require('yeoman-generator');


module.exports = yeoman.Base.extend({
  prompting() {
    const done = this.async();

    this.prompt([{
      type: 'confirm',
      message: chalk.bold('This command will install hotcopy credentials on your machine. This is a one-time, per-computer install so you shouldn\'t have to run this again unless something major changes. Ready?'),
      name: 'ready',
    }], (answers) => {
      this.prefs = answers;
      this.log('');
      done();
    });
  },

  writing: {
    googlekeys() {
      const done = this.async();

      if (this.prefs.ready === false) {
        done();
        return;
      }

      const destinarionDir = path.join(os.homedir(), '.dmn-interactives');
      mkdirp(destinarionDir);

      let awsCredentials;
      try {
        awsCredentials = JSON.parse(fs.readFileSync('./aws.json', 'utf8'));
      } catch (e) {
        this.log(chalk.bold(`${chalk.red('No aws.json found.')} Run this command inside an existing project or run ${chalk.magenta('yo dmninteractives:aws')} to create an aws.json.`));
        process.exit(1);
      }

      const service = new S3({
        apiVersion: '2006-03-01',
        credentials: {
          accessKeyId: awsCredentials.accessKeyId,
          secretAccessKey: awsCredentials.secretAccessKey,
          region: 'us-east-1',
        },
      });

      service.getObject({
        Bucket: 'interactives-private',
        Key: 'credentials/hot-copy-credentials.json',
      }, (err, obj) => {
        if (err && err.statusCode === 403) {
          const errMsg = chalk.red('Could not connect to AWS using your credentials.');
          this.log(chalk.bold(`${errMsg} You should fix your credentials in aws.json (or run ${chalk.magenta('yo dmninteractives:aws')}) before trying again.`));
          process.exit(1);
        } else {
          done(err);
        }

        this.fs.write(path.join(destinarionDir, 'hot-copy-credentials.json'), obj.Body);
        done();
      });
    },
  },

  end() {
    if (this.prefs.ready === false) {
      this.log('👋  See ya.');
      return;
    }

    this.log(`\n${chalk.bold('Done!')} Google credentials for hotcopy have been saved to ${chalk.bold(chalk.yellow('~/.dmn-interactives/hot-copy-credentials.json.'))}`);
  },

});
