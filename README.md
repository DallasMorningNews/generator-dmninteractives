# generator-dmninteractives

A [Yeoman](http://yeoman.io) generator for DMN-flavored "interactive" pages with easy publishing. 

Translation: A simple app that helps speed up developing a custom "interactive" page using our DMN house template. 

### What it does:

- Scaffolds your project's development directory, shortcutting setup time.
- Downloads and bundles your dependencies into single, minified files.
- Compiles SCSS files.
- Bundles and minifies CSS and JS files.
- Populates metatags from a JSON file for SEO.
- Creates responsive image sets optimized for mobile devices.
- Publishes your project to an Amazon S3 bucket (our cloud).
- Creates an archive of your development directory so you or anyone else can pick up your project exactly where you left it.

## See the [wiki](https://github.com/DallasMorningNews/generator-dmninteractives/wiki) for complete instructions on using the app.

## Quickstart

Install global dependencies, including Yeoman and the generator.

```bash
$ npm install -g nodemon
$ npm install -g gulp
$ npm install -g yo
$ npm install -g generator-dmninteractives
```

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

### Build, Preview, Publish

Your project is separated into three main directories: 
- `build`
- `preview` 
- `publish`


The `build` directory is your working directory. You'll write all your code and place all necessary static assets in this directory.

The `preview` directory includes rendered SCSS and responsive images. The live preview of your page which gulp starts is serving from this folder. As you make changes in your `build` directory, your project will be automatically compiled in this directory. 

The `publish` directory contains the final, rendered webpage and minified static assets that will be published. Assets are moved into this folder when you run:

```bash
$ gulp publish
```
