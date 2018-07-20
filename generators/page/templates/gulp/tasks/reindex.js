/* eslint-disable strict */

'use strict';

/* eslint-enable strict */
const c = require('ansi-colors');
const log = require('fancy-log');
const request = require('request');

const awsCredentials = require('./../../aws.json');
const interactiveUrl = require('./../../meta.json').url;


const DATALAB_PUBLISH_WEBHOOK = 'https://datalab.dallasnews.com/interactives/webhooks/publish/';


/**
 * A Gulp task to notify our DataLab publishing API that this interactive has
 * been updated
 * @see https://github.com/DallasMorningNews/dataLab/pull/168 for API details
 */
module.exports = (cb) => {
  log.info(`Notifying DataLab of update to ${c.cyan(interactiveUrl)}...`);

  request.post({
    uri: DATALAB_PUBLISH_WEBHOOK,
    form: {
      url: interactiveUrl,
      'aws-access-key-id': awsCredentials.accessKeyId,
      'aws-secret-access-key': awsCredentials.secretAccessKey,
    },
  }, (err, resp, body) => {
    if (err) {
      cb(err);
      return;
    }

    if (resp.statusCode === 200) {
      // Success
      JSON.parse(body).queued.forEach((q) => {
        log.info(`${c.cyan(q.headline)} has been queued for reindexing by DataLab`);
      });
    } else if (resp.statusCode === 400) {
      // Bad API call
      const msg = `An error occurred with the DataLab API: ${JSON.parse(body).error.message}`;
      log.error(`Failed to reindex interactive: ${c.red.bold(msg)}`);
    } else if (resp.statusCode === 401 || resp.statusCode === 403) {
      // Interactive not found, too many returned or permissions error
      log.error(`DataLab failed to reindex interactive: ${c.yellow.bold(JSON.parse(body).error.message)}`);
    } else {
      // (Hopefully temporary) server error
      log.error(`Failed to reindex interactive: ${c.red.bold('An error occurred with the DataLab API. You should wait a few minutes then retry by running "gulp reindex".')}`);
    }

    cb();
  });
};
