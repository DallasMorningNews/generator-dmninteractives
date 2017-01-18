'use strict';
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({

  prompting() {
    const done = this.async();

    this.log('    ____  __  ____   _____\n');
    this.log('   / __ \\/  |/  / | / /   |  ____  ____  _____\n');
    this.log('  / / / / /|_/ /  |/ / /| | / __ \\/ __ \\/ ___/\n');
    this.log(' / /_/ / /  / / /|  / ___ |/ /_/ / /_/ (__  )\n');
    this.log('/_____/_/  /_/_/ |_/_/  |_/ .___/ .___/____/\n');
    this.log('                         /_/   /_/            \n');

    var generatorDir = path.join(this.sourceRoot(), '../..');
    var generatorSubdirs = _.filter(
      fs.readdirSync(generatorDir),
      function(pathName) {
        return fs.statSync(path.join(generatorDir, pathName)).isDirectory();
      }
    );

    var subGeneratorConfigs = [];
    _.each(generatorSubdirs, function(dirName) {
      var rawConfigPath = path.join(generatorDir, dirName, 'config.json');

      if (fs.existsSync(rawConfigPath)) {
        var rawConfig = require(rawConfigPath);

        var finalConfig = _.clone(rawConfig);

        finalConfig.typeSlug = dirName;

        subGeneratorConfigs.push(finalConfig);
      }
    });

    subGeneratorConfigs = _.sortBy(subGeneratorConfigs, 'priority');

    this.subGeneratorConfigs = subGeneratorConfigs;

    var prompts = [
      {
        type: 'list',
        name: 'module',
        message: 'Welcome. What would you like to make today?',
        choices: _.map(
          this.subGeneratorConfigs,
          function(config) {
            return { name: config.verboseName, value: config.typeSlug };
          }
        )
      }
    ];

    this.prompt(prompts, (props) => {
      this.props = props;
      done();
    });
  },

  subgen: function () {
    if (
      _.contains(
        _.pluck(this.subGeneratorConfigs, 'typeSlug'),
        this.props.module
      )
    ) {
      this.composeWith('dmninteractives:' + this.props.module);
    }
  },
});
