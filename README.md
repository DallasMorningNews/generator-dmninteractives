# generator-dmnapps 

A [Yeoman](http://yeoman.io) generator for DMN-flavored node apps.

## Using 

First, install Yoeman and the dmnapps generator, globally:

```bash
npm install -g yo
npm install -g generator-dmnapps
```

Create a clean directory for your app:

```bash
mkdir your-app-directory
cd your-app-directory
```

Finally, initiate the generator in your app directory.

```bash
yo dmnapps
```

The generator will set up your working directory, install dependencies, copy template files and scripts, start a `nodemon` server and open your browser.

This generator use `gulp` to watch your directories for changes, compile scss files and automatically reload your browser.

You can also start your server from scratch in your app's root directory:

```bash
gulp
```


## License

MIT
