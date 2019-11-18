# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/) from v0.5.0 forward.

## [Unreleased]
### Fixed
- Version bump [lodash](https://lodash.com/) to `^4.17.11` to mitigate [CVE-2018-16487](https://nvd.nist.gov/vuln/detail/CVE-2018-16487)

## [0.8.8] - 2019-11-18
### Changed
- Changed default Montserrat weight for interactive embeds from 300 to 400
- Bump esLint to @4 for interactive pages

## [0.8.7] - 2019-01-22
### Changed
- Pin `event-stream` dependency to 3.3.4 in generated projects due to [security vulnerability](https://github.com/dominictarr/event-stream/issues/116)
- Bump `underscore-string`, per recommendation from `npm audit`

## [0.8.6] - 2018-11-27
### Changed
- Changes `/graphic-module/templates/package.json` event-stream to <=3.3.4 to address security vulnerability

## [0.8.5] - 2018-10-11
### Added
- Adds call to new 'slideshow.js' file in starterkit to page/config.json
- Adds call to new 'charts.scss' and 'subscribe.scss' files in starterkit to page/config.json
- Adds call to new 'styleguide.md' file in starterkit to page/config.json
### Removed
- Removed some calls to outdated scss files in page/config.json


## [0.8.4] - 2018-10-09
### Fixed
- Include `/images/` in URL for share image in meta.json
- Also invalidate root paths (`year/slug/`) in Cloudfront [#67](https://github.com/DallasMorningNews/generator-dmninteractives/issues/67)

## [0.8.3] - 2018-08-21
### Fixed
- Fixed an error where files that didn't match a ["route"](https://github.com/DallasMorningNews/generator-dmninteractives/blob/b84e0bbe16f70f7ef469fd1a010df26f9759aad6/generators/page/templates/gulp/tasks/aws.js#L38-L56) pattern in our AWS publishing stream would throw an error

## [0.8.2] - 2018-08-2
### Changed
- Only include 300 and 700 weight Monsterrat

## [0.8.1] - 2018-07-26
### Changed
- Changes base sans-serif font to Montserrat from Gotham.

## [0.8.0] - 2018-07-26
### Added
- All generators now offer to create a new repo with [`git-secrets`](https://github.com/awslabs/git-secrets) protection
- Auto-create an [.nvmrc file](https://github.com/creationix/nvm#nvmrc) to store Node version at time of project creation

### Changed
- Drop `string` module due to [CVE-2017-16116](https://nvd.nist.gov/vuln/detail/CVE-2017-16116) and replace with `underscore.string`

### Fixed
- Bumped `node-sass` version, switched to [SCSS version](https://github.com/JohnAlbin/normalize-scss) of Normalize.css and added [Eyeglass](https://github.com/sass-eyeglass/eyeglass) support due to pending deprecation of CSS imports in `node-sass` [#65](https://github.com/DallasMorningNews/generator-dmninteractives/issues/65)

## [0.7.7] - 2018-07-23
### Added
- Invalidate Cloudfront for published objects during publish [#59](https://github.com/DallasMorningNews/generator-dmninteractives/issues/59)
- Add cache headers to images and videos [#59](https://github.com/DallasMorningNews/generator-dmninteractives/issues/59)

### Changed
- Publishes test content as private to new password-protected test bucket
- Enabled grid support to autoprefixer for pages and embeddable graphics.

### Fixed
- Also watch SVGs in `src/` and rerun the Nunjucks renderer when they change [#58](https://github.com/DallasMorningNews/generator-dmninteractives/issues/58)
- Update `node-mime` due to [CVE-2017-16138](https://nvd.nist.gov/vuln/detail/CVE-2017-16138)

## [0.7.6] - 2018-04-30
### Fixed
- Bump BrowserSync version in generated apps to close [vulnerability](https://github.com/BrowserSync/browser-sync/issues/1546) in `localtunnel` dependency, which relies on a vulnerable version of `hoek`
- Bump `octonode` version in this repo to fix a similar dependency on `hoek`
- Repair CHANGELOG

## [0.7.5] - 2018-03-01
### Changed
- Updates font weights for new font stack

## [0.7.4] - 2018-02-26
### Changed
- Switches typography.com call to DMN house account
- Pin frontend dependencies (jQuery, etc.) at major version so we get the latest and greatest
- Include [package-lock.json](package-lock.json) file in VC

## [0.7.3] - 2018-02-14
### Fixed
- Correctly prepends leading `0` in dates in meta.json

## [0.7.2] - 2017-12-27
### Fixed
- Resolves correct version number for npm and github

## [0.7.1] - 2017-12-27
### Fixed
- Corrected esLintConfig parser in linters/index.js

## [0.7.0] - 2017-12-12
### Added
- There's now a [`.browserslistrc` config file](https://github.com/ai/browserslist), which specifies the browsers we support (for now, anything with greater than 2% usage within the US or that is one of the last major versions). JS transpilers and CSS post-processors will now reference this file.
- Transpiled CSS is now auto-prefixed using [Autoprefixer](https://github.com/postcss/autoprefixer)'s [PostCSS](https://github.com/postcss/postcss) plugin to be compatible with our list of supported browsers (see above).

### Changed
- Switch from `babel-preset-es2015` to its replacement, [`babel-preset-env`](https://github.com/babel/babel/tree/master/packages/babel-preset-env)
- Bumped the 3.x version of `gulp-sass` for the page generator (the embeddable already had it). It `npm install`s much, much quicker than the 2.x version.
- Deprecate the non-Browserify-ed, original interactives generator. RIP.
- All output package.json files now specify `UNLICENSED` instead of `ISC` in the license field and are marked private
- Clarified language about what is tracked by `git` and how the assets and data folders and handled

### Fixed
- Render HTML and copy all static assets during initial build (see #56)
- Fix for error during template rendering in page generator caused by meta.json author property being a string instead of an array

## [0.6.3] - 2017-12-11
### Changed
- Update Parse.ly tags to newer JSON+LD format

## [0.6.2] - 2017-09-15
### Changed
- Fine-tunes styles from 0.6.1.

## [0.6.1] - 2017-09-15
### Added
- Add `_ooyala.scss` sass file for controlling ooyala styles.
- Add base styles for `p` and `a` tags, along with `.source` and `.credit` lines

### Changed
- More semantic class names on the embeddable container, chatter and body class.

## [0.6.0] - 2017-07-28
### Added
- Add a README file to Browserify-ed projects (much like the embeddable one)
- Soft-pin (`^`) the versions for `eslint-config-airbnb` and its peer dependencies because installing the latest version of it and its peers often results in ESlint errors (see #53)

### Changed
- Use a single, universal `.gitignore` file that properly excludes various system files, video and audio
- Changes the default project structure, creating separate directories for original media assets, data, etc.
- Embeddables now follow the same directory structure as interactives, housing all relevant files in the `src` directory
- Don't track video, audio and ZIP files in `git`

### Fixed
- URLs in the meta.json are now https

## [0.5.2] - 2017-06-21
### Changed
- Provided ESLint config now sets the environment to browser so `window`, `document`, etc. shouldn't cause warnings anymore

### Fixed
- Pins ESlint at version 3 because our configs aren't yet 4.x.x-compatible

## [0.5.1] - 2017-04-13
### Changed
- Gulp templates in `page-browserify` generator now have `'use strict'` declarations, which enable backward-compatibility with older Node versions on users' systems.
- The 'page-browserify' subgenerator now knows to copy 'furniture.js' and 'components/\*.scss' files from the `DallasMorningNews/interactives_starterkit` repo. This reflects a refactoring of the files within `interactives_starterkit`.

## [0.5.0] - 2017-04-05
### Changed
- New system for configuring sub-generators' names, descriptions and ordering in the "What would you like to make today?" prompt. See `./generators/page-browserify/config.json` for an example, and `./generators/app/index.js` for implementation.
- New system for retrieving needed JS, CSS and HTML files from `DallasMorningNews/interactives_starterkit` repo for `page-browserify` generator projects. See `./generators/page-browserify/config.json` for example and `./generators/page-browserify/index.js` for implementation.

### Added
- `page-browserify` generator for ES6-enabled interactive pages.
- NPM installability for `page-browserify` projects' dependencies.
- Google Analytics tracking script for `embeddable-graphic` projects.

## [0.4.2] - 2017-03-28
### Changed
- `page` generator now copies over component scss files via `index.js`.

## [0.4.1] - 2017-03-21
### Added
- Base styles and default chatter structure for `embeddable-graphic` generator.

### Changed
- `page` generator now uses correct syntax for `authorFBProfile` tag in `meta.json`.

### Fixed
- Resolved an errant `body *:after` selector in `embeddable-graphic` styles.

## [0.4.0] - 2017-02-10
### Added
- `page` generator now has Facebook author and publisher tags in `meta.json`.

## [0.3.9] - 2017-02-09
### Fixed
- New release number for distribution.

## [0.3.8] - 2017-02-03
### Added
- New generator: `embeddable-graphic` for graphics that get placed within Serif pages.

## [0.3.7] - 2017-01-31
### Changed
- `graphic` generator now calls header and footer CSS separately (as other generators do).

## [0.3.6] - 2017-01-31
### Changed
- `page` generator now calls header and footer CSS (and furniture JS) from separate files.

## [0.3.5] - 2016-10-27
### Changed
- Update instructions for placing multiple authors' names in `page` generator's `meta.json` file.

## [0.3.4] - 2016-10-23
### Changed
- `graphic` generator now uses the supplied JS class name in the generated README, `package.json` and CSS files.
- Added new SCSS styles to `graphic` generator, and removed default Chartwerk styles for fewer assumptions.

## [0.3.3] - 2016-10-22
### Added
- `graphic` generator now has explicit babelify transform properties.

## [0.3.2] - 2016-10-22
### Added
- New generator: `graphic` for reusable graphics; created in the context of 2016 general election coverage and useful in many other scenarios. (Note: a `graphic` generator nominally existed prior to this version, but was incomplete and mostly not usable.)

## [0.3.1] - 2016-09-19
### Changed
- `page` generator now includes `build/static/images/opt` directory in `.gitignore`.
- `page` generator now _excludes_ `build/static/vendor` directory from `.gitignore` (so the directory is uploaded to git), but ignores all files within that directory except a `.gitkeep` helper file to prevent vendored (that is, bower-installed) code from being uploaded to git.
- `page` generator now creates a `.gitkeep` file in `build/static/vendor`, to enable the behavior described above.

## [0.3.0] - 2016-09-12
### Changed
- `page` and `graphic` generators no longer upload ZIP files of the entire project to S3 when publishing. (We'll store the project code via Git instead from here on.)


## [0.2.5] - 2016-08-13
**Description to be added**

## [0.2.4] - 2016-05-27
**Description to be added**

## [0.2.3] - 2016-04-12
**Description to be added**

## [0.2.2] - 2016-04-08
**Description to be added**

## [0.2.1] - 2016-04-08
**Description to be added**

## [0.2.0] - 2016-04-06
**Description to be added**

## [0.1.3] - 2016-01-31
**Description to be added**

## [0.1.2] - 2016-01-05
**Description to be added**

## [0.1.1] - 2016-01-05
**Description to be added**

## [0.1.0] - 2016-12-15
**Description to be added**

## [0.0.9] - 2015-12-10
**Description to be added**

## [0.0.8] - 2015-11-17
**Description to be added**

## [0.0.7] - 2015-11-09
**Description to be added**

## [0.0.6] - 2015-11-05
**Description to be added**

## [0.0.5] - 2015-10-27
**Description to be added**

## [0.0.4] - 2015-10-25
**Description to be added**

## [0.0.3] - 2015-10-24
**Description to be added**

## [0.0.2] - 2015-10-24
**Description to be added**

## 0.0.1 - 2015-10-12
### Added
- Initial working versions of files.

[Unreleased]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.8.8...HEAD
[0.8.8]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.8.7...v0.8.8
[0.8.7]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.8.6...v0.8.7
[0.8.6]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.8.5...v0.8.6
[0.8.5]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.8.4...v0.8.5
[0.8.4]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.8.3...v0.8.4
[0.8.3]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.8.2...v0.8.3
[0.8.2]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.8.1...v0.8.2
[0.8.1]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.7.7...v0.8.0
[0.7.7]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.7.6...v0.7.7
[0.7.6]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.7.5...v0.7.6
[0.7.5]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.7.4...v0.7.5
[0.7.4]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.7.3...v0.7.4
[0.7.3]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.7.2...v0.7.3
[0.7.2]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.7.1...v0.7.2
[0.7.1]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.6.3...v0.7.0
[0.6.3]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.6.2...v0.6.3
[0.6.2]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.5.2...v0.6.0
[0.5.2]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.4.2...v0.5.0
[0.4.2]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.3.9...v0.4.0
[0.3.9]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.3.7...v0.3.9
[0.3.7]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.3.6...v0.3.7
[0.3.6]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.3.4...v0.3.6
[0.3.4]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.2.5...v0.3.0
[0.2.5]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.0.9...v0.1.0
[0.0.9]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.0.8...v0.0.9
[0.0.8]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/DallasMorningNews/generator-dmninteractives/compare/v0.0.1...v0.0.2
