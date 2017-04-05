# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/) from v0.5.0 forward.

## [Unreleased]
(No changes yet)

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

[Unreleased]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.5.0...HEAD
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