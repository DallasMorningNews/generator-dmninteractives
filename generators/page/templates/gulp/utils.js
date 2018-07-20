/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const S = require('string');

const meta = require('./../meta.json');


/**
 * Get the directory this page should publish to (<year>/<slug>/)
 *
 * @returns {string}
 */
const getAwsDirectory = () => {
  const appName = S(meta.name).slugify().s;
  const year = meta.publishYear;

  return `${year}/${appName}/`;
};


module.exports = {
  getAwsDirectory,
};
