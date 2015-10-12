# generator-dmnapps 

A [Yeoman](http://yeoman.io) generator for DMN-flavored "interactive" pages with easy publishing.

## Using 

First, install Yoeman and the dmninteractives generator, globally:

```bash
npm install -g yo
npm install -g generator-dmninteractives
```

Create a clean directory for your app:

```bash
mkdir your-app-directory
cd your-app-directory
```

Finally, initiate the generator in your app directory.

```bash
yo dmninteractives
```

The generator will set up your working directory, install and inject dependencies, copy template files and scripts, start a `nodemon` server and open your browser.

This generator uses `gulp` to watch your directories for changes, compile scss files and automatically reload your browser.

You can also start your server from scratch in your app's root directory:

```bash
gulp
```


## Publishing

First, add the appropriate credentials to `aws.json`, and then:

```bash
gulp publish
```

The publish command will upload your project to a directory in the designated AWS S3 bucket. It will also zip up your working directory (excluding `aws.json`, of course) and deposit a compressed file at the root of the new project directory.

You can download the zip file to reconsistute the published project wherever you need, just add a new `aws.json`.

## License

MIT
