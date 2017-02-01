'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async();

    this.log('    ____  __  ____   _____\n   / __ \\/  |/  / | / /   |  ____  ____  _____\n  / / / / /|_/ /  |/ / /| | / __ \\/ __ \\/ ___/\n / /_/ / /  / / /|  / ___ |/ /_/ / /_/ (__  )\n/_____/_/  /_/_/ |_/_/  |_/ .___/ .___/____/\n                         /_/   /_/            \n');


    var prompts = [
      {
        type: 'list',
        name: 'module',
        message: 'Welcome. What would like to make today?',
        choices: [
          {
            name: 'Interactive page',
            value: 'page'
          },{
            name: 'Embeddable graphic',
            value: 'embeddable-graphic'
          }, {
            name: 'Graphic module',
            value: 'graphic-module'
          }
        ]
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  subgen: function () {
    if(this.props.module === 'page'){
      this.composeWith('dmninteractives:page');
    }else if(this.props.module === 'embeddable-graphic'){
      this.composeWith('dmninteractives:embeddable-graphic');
    } else if(this.props.module === 'graphic-module'){
      this.composeWith('dmninteractives:graphic-module');
    }
  },
});
