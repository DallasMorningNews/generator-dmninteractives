/**
 * Mix this into your generator by adding a composeWith('nvm') to your
 * generator's initializing() method to add auto-creation of .nvmrc
 */
const semver = require('semver');
const yeoman = require('yeoman-generator');


module.exports = yeoman.Base.extend({
  writing() {
    if (semver.valid(process.version) !== null) {
      this.fs.write('.nvmrc', `${semver.major(process.version)}.${semver.minor(process.version)}`);
    }
  },
});
