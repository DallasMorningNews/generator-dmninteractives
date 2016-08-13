'use strict';
var yeoman      = require('yeoman-generator');

module.exports = yeoman.Base.extend({
	writing: {
		gulpfiles: function(){
			this.fs.copy(
				this.templatePath('index.js'),
				this.destinationPath('./gulp/index.js')
			);
			this.fs.copy(
				this.templatePath('./tasks/**/*'),
				this.destinationPath('./gulp/tasks/')
			);
		}
	}
})