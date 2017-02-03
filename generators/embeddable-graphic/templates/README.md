# <%= slug %>

This is an embeddable graphic built using the [`dmninteractives` Yeoman generator](https://github.com/DallasMorningNews/generator-dmninteractives). It's designed to be embedded using [Pym.js](http://blog.apps.npr.org/pym.js/) as a responsive `iframe`.

## Requirements

- Node - `brew install node`
- Gulp - `npm install -g gulp-cli`

## Local development

#### Installation

1. `npm install` to install development tooling
2. `gulp` to open a local development server

#### What's inside

- `dist/index.html` - Graphic HTML markup; there's no Nunjucks, etc. so this is just straight HTML
- `dist/embed.html` - A page to test your embed
- `src/js/*.js` - Graphic scripts, written in ES2015 and transpiled with Babel
- `src/sass/*.scss` - Graphic styles in SCSS

#### Publishing

`gulp publish` will upload your [`dist/`](dist/) folder to the `embeds/<%= year %>/<%= slug %>/` folder on our interactives S3 bucket.

## Usage

#### Embedding in Serif

The below embed code can be pasted into a Serif "code block":

```html
<div id="embed-<%= slug %>" class="embed-preview"></div>

<script src="//pym.nprapps.org/pym.v1.min.js"></script>
<script>new pym.Parent('embed-<%= slug %>', '//interactives.dallasnews.com/embeds/<%= year %>/<%= slug %>/', {})</script>
```

## Copyright

&copy;<%= year %> The Dallas Morning News
