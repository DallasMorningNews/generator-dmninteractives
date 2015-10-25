# generator-dmninteractives

A [Yeoman](http://yeoman.io) generator for DMN-flavored "interactive" pages with easy publishing. 

Translation: A simple app that helps speed up developing a custom "interactive" page using our DMN house template, packages your files for optimum pageload speed, quickly publishes to our Amazon service and archives your working directory. 

### What it does:

- Scaffolds your project's development environment, shortcutting setup. 
- Downloads and bundles your dependencies into single, minified files.
- Compiles SCSS files.
- Minifies CSS and JS files.
- Populates metatags from a JSON file for SEO.
- Creates responsive image sets optimized for mobile devices.
- Publishes your project to an Amazon S3 bucket.
- Creates an archive of your development environment.

## Setting up your computer

First, you need [node.js](https://nodejs.org/en/download/).

(Total noobs, you'll want to checkout [console basics](https://www.youtube.com/watch?v=-Vl4rpZVA6I) before you go on here.)

Install prerequisites nodemon, gulp, Yoeman and the dmninteractives generator, globally, using npm:

```bash
$ npm install -g nodemon
$ npm install -g gulp
$ npm install -g yo
$ npm install -g generator-dmninteractives
```

You'll also need to make sure you have installed [GraphicsMagick](http://www.graphicsmagick.org/README.html) in order to create responsive image sets.


## Starting a new project

Create a clean directory for your project in your terminal.

```bash
$ mkdir your-app-directory
$ cd your-app-directory
```

Run the generator in your new project directory.

```bash
$ yo dmninteractives
```

Prompts will ask you to name your project, add AWS credentials (ask the data team) and select dependencies.

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

#### Build

The `build` directory is the development directory. It contains your un-minified stylesheets and scripts, raw images and html templates.

You'll write all your code and place all necessary static assets in this directory.

#### Public

The `public` directory contains the final, rendered webpage and minified static assets that will be published.

As you make changes in your `build` directory, your project will be automatically compiled in the `public` directory. 

This is the directory gulp creates a local webserver to serve from.

### Static files

All CSS and JS files in `build/static/css` and `build/static/js` are combined into single, minified files. Both files are **already included** in the template:

```html
<!-- HEAD section -->
<link rel="stylesheet" type="text/css" href="static/css/styles.css"/>

<!-- Foot of BODY -->
<script type="text/javascript" src="static/js/scripts.js"></script>
```

Multiple CSS files are combined in alphabetical sort order, preceeded by any dependency stylesheets and the template theme stylesheet.

Use relative links for images or JSON data that match relative paths in the `public` directory. For example:

```html
<img src="static/img/someImage.png"/>

<script type="text/javascript">
    $.getJSON( "static/js/data.json", function( data ) {
        ...
    })
</script>
```

Remember, script files and stylesheets are minified in the `public` directory.

### Vendor assets

All CSS and JS files put in the `build/static/vendor/` directory will be bundled into a single JS and CSS file called `dependency-bundle`. Both are already added to the template.


### Responsive images

Images put in the build directory `build/static/img/` are automatically resized into responsive copies at 4 widths: 2400px, 1280px, 640px and 320px. To use the smaller-sized images on smaller screens, use the following `srcset` syntax in your image tags:

```html
<img src="static/img/cat.jpg" alt="A black cat" 
  srcset="static/img/cat-320.jpg 320w, static/img/cat-640.jpg 640w, static/img/cat-1280.jpg 1280w, static/img/cat-2400.jpg 2400w">
```


## Publishing your project

Simply run:

```bash
$ gulp publish
```

A prompt will confirm what directory to upload the `public` directory to in our `interactives.dallasnews.com` S3 bucket. It will also zip up your working directory (excluding `aws.json`, for security) and deposit a compressed file at the root of the new project directory.

You can download the zip file to reconstitute the published project wherever you need, just add a new `aws.json`.
