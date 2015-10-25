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

### Build vs. Public directories

Your project is separated into two main directories: a `build` and a `public` folder.


The `build` directory is the development directory. You'll write all your code and place all necessary static assets in this directory.


The `public` directory contains the final, rendered webpage and minified static assets that will be published.

As you make changes in your `build` directory, your project will be automatically compiled in the `public` directory. 


### Static files

All CSS and JS files in `build/static/css` and `build/static/js` are combined into single, minified files. Both files are **already included** in the base template:

Multiple CSS files are combined in alphabetical sort order, preceeded by any dependency stylesheets and the template theme stylesheet.


### Vendor assets

All CSS and JS files put in the `build/static/vendor/` directory will be bundled into a single JS and CSS file called `dependency-bundle`. Both are already added to the template.

## Publishing your project

Simply run:

```bash
$ gulp publish
```

A prompt will confirm what directory to upload the `public` directory to in our `interactives.dallasnews.com` S3 bucket. It will also zip up your working directory (excluding `aws.json`, for security) and deposit a compressed file at the root of the new project directory.

You can download the zip file to reconstitute the published project wherever you need. Just add a new `aws.json`.
