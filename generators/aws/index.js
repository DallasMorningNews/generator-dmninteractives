const chalk = require('chalk');
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const yeoman = require('yeoman-generator');


module.exports = yeoman.Base.extend({
  prompting() {
    const done = this.async();

    const warning = fs.existsSync('./aws.json') ? [{
      type: 'confirm',
      message: 'An aws.json file already exists in this project. Would you like to enter new credentials anyway? Doing so will overwrite it.',
      name: 'overwrite',
    }] : [];

    this.prompt(warning, (warningAnswers) => {
      if (warningAnswers.overwrite === false) {
        this.prefs = warningAnswers;
        done();
        return;
      }

      const prompts = [{
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

        if (answers.overwrite === false) {
          done();
          return;
        }

        const service = new S3({
          apiVersion: '2006-03-01',
          credentials: {
            accessKeyId: answers.awsAccessKey,
            secretAccessKey: answers.awsSecretKey,
            region: 'us-east-1',
          },
        });

        // Try to get an object from S3 to test the provided credentials
        service.getObject({
          Bucket: 'interactives.dallasnews.com',
          Key: 'index.html',
        }, (err) => {
          // If they validate, move on silently
          if (!err) {
            done();
            return;
          }

          // If the credentials are denied, see if the user wants to re-enter
          if (err.statusCode === 403) {
            const errMsg = chalk.red('Could not connect to AWS using your credentials.');

            this.prompt([{
              type: 'confirm',
              message: `${errMsg} Would you like to try again to enter your credentials?`,
              name: 'retryAws',
            }], (retryAnswer) => {
              // If she does, go back to the beginning
              if (retryAnswer.retryAws) {
                this.prompting();
                return;
              }

              // If she doesn't, move on but warn
              this.log(`Writing aws.json anyway. You can run ${chalk.bold(chalk.magenta('yo dmninteractives:aws'))} to update it later with new credentials.`);
              done();
            });
          } else {
            // Throw errors that are non-403 errors
            done(err);
          }
        });
      });
    });
  },

  writing: {
    aws() {
      if (this.prefs.overwrite === false) {
        return;
      }

      const awsJson = {
        accessKeyId: this.prefs.awsAccessKey,
        secretAccessKey: this.prefs.awsSecretKey,
        params: {
          Bucket: 'interactives.dallasnews.com',
        },
      };

      this.fs.writeJSON('aws.json', awsJson);
    },
  },

});
