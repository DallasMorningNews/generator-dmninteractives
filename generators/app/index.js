const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({

  prompting() {
    const done = this.async();

    this.log('    ____  __  ____   _____\n');
    this.log('   / __ \\/  |/  / | / /   |  ____  ____  _____\n');
    this.log('  / / / / /|_/ /  |/ / /| | / __ \\/ __ \\/ ___/\n');
    this.log(' / /_/ / /  / / /|  / ___ |/ /_/ / /_/ (__  )\n');
    this.log('/_____/_/  /_/_/ |_/_/  |_/ .___/ .___/____/\n');
    this.log('                         /_/   /_/            \n');


    const generatorDir = path.join(this.sourceRoot(), '../..');
    const generatorSubdirs = _.filter(
      fs.readdirSync(generatorDir),
      // eslint-disable-next-line comma-dangle
      pathName => fs.statSync(path.join(generatorDir, pathName)).isDirectory()
    );

    let subGeneratorConfigs = [];
    _.each(generatorSubdirs, (dirName) => {
      const rawConfigPath = path.join(generatorDir, dirName, 'config.json');

      if (fs.existsSync(rawConfigPath)) {
        // eslint-disable-next-line import/no-dynamic-require,global-require
        const rawConfig = require(rawConfigPath);

        const finalConfig = _.clone(rawConfig);

        finalConfig.typeSlug = dirName;

        subGeneratorConfigs.push(finalConfig);
      }
    });

    subGeneratorConfigs = _.sortBy(subGeneratorConfigs, 'priority');

    this.subGeneratorConfigs = subGeneratorConfigs;

    const prompts = [
      {
        type: 'list',
        name: 'module',
        message: 'Welcome. What would like to make today?',
        choices: _.map(
          this.subGeneratorConfigs,
          // eslint-disable-next-line comma-dangle
          config => ({ name: config.verboseName, value: config.typeSlug })
        ),
      },
    ];

    this.prompt(prompts, (props) => {
      this.props = props;
      done();
    });
  },

  subgen() {
    if (_.contains(_.map(this.subGeneratorConfigs, 'typeSlug'), this.props.module)) {
      this.composeWith(
        `dmninteractives:${this.props.module}`,
        {
          options: {
            baseConfig: _.find(this.subGeneratorConfigs, { typeSlug: this.props.module }),
          },
        }  // eslint-disable-line comma-dangle
      );
    }
  },
});
