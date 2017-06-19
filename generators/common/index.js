/**
 * Mix this generator in to get common files that we should have in all of our
 * projects. For now it's just a .gitignore, but anything that lives in all
 * projects is a good fit for this subgenerator.
 */

const yeoman = require('yeoman-generator');


module.exports = yeoman.Base.extend({
  writing() {
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')  // eslint-disable-line comma-dangle
    );
  },
});
