# generator-dmninteractives [![NPM version][npm-image]][npm-url]

A [Yeoman](http://yeoman.io) generator for DMN-flavored "interactive" pages with easy publishing.

Translation: A simple app that helps speed up developing a custom "interactive" page using our DMN house template.

### What it does:

- Scaffolds your project's development directory, shortcutting setup time.
- Downloads and bundles your dependencies into single, minified files.
- Compiles SCSS files.
- Bundles and minifies CSS and JS files.
- Populates metatags from a JSON file.
- Creates responsive image sets optimized for mobile devices.
- Publishes your project to an Amazon S3 bucket.
- Creates an archive of your development directory so you or anyone else can pick up your project exactly where you left it.

## See the [wiki](https://github.com/DallasMorningNews/generator-dmninteractives/wiki) for complete instructions on using the app.

## Quickstart

Install global dependencies, including Yeoman and the generator.

```bash
$ npm install -g gulp-cli
$ npm install -g yo
$ npm install -g --production generator-dmninteractives
```

_(The `--production` flag is optional, but prevents your global Node modules folder from getting confused by the dev tooling for the generator)_

Create a clean directory for your project in your terminal.

```bash
$ mkdir your-app-directory
$ cd your-app-directory
```

Run the generator in your new project directory.

```bash
$ yo dmninteractives
```

The generator will set up your working directory, install dependencies, copy template files and scripts, start a local webserver and open your browser.

Be sure to fill out the `meta.json` file to correctly complete metatags in the template.

## Developing your project

### Gulp

The generator uses [gulp](http://gulpjs.com/), a node-based task runner, to watch your directories for changes as you code, render templates, prepare static files and start a local webserver to preview your project in the browser.

To work on your project, launch gulp in your app's root directory:

```bash
$ gulp
```

Your project is separated into two main directories:
- `build`
- `public`


The `build` directory is your working directory. You'll write all your code and place all necessary static assets in this directory.

The `public` directory includes transpiled SCSS, minified JavaScript and responsive images. Gulp serves a live preview of your page from this folder.

## Publishing

To publish to an AWS S3 bucket, fill out `aws.json`, if you didn't during setup. Then execute one of the gulp publish commands to publish to either the test or production directory of the bucket:
- `gulp publish`
- `gulp publish-test`

[npm-image]: https://badge.fury.io/js/generator-dmninteractives.svg
[npm-url]: https://npmjs.org/package/generator-dmninteractives
