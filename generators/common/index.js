/**
 * Mix this generator in to get common files that we should have in all of our
 * projects. For now it's just a .gitignore, but anything that lives in all
 * projects is a good fit for this subgenerator.
 */

const mkdirp = require('mkdirp');
const yeoman = require('yeoman-generator');


module.exports = yeoman.Base.extend({
  writing: {
    git() {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')  // eslint-disable-line comma-dangle
      );

      this.fs.copy(
        this.templatePath('gitkeep'),
        this.destinationPath('./src/assets/.gitkeep')  // eslint-disable-line comma-dangle
      );

      this.fs.copy(
        this.templatePath('gitkeep'),
        this.destinationPath('./src/data/.gitkeep')  // eslint-disable-line comma-dangle
      );
    },

    directories() {
      mkdirp('./dist');
    },
  },
});
