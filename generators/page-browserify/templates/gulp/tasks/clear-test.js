/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const aws = require('aws-sdk');
const gulp = require('gulp');
const S = require('string');


const awsJson = require('./../../aws.json');
const meta = require('./../../meta.json');


const appName = S(meta.name).slugify().s;


module.exports = () => {
  aws.config.update({
    accessKeyId: awsJson.accessKeyId,
    secretAccessKey: awsJson.secretAccessKey,
    region: 'us-east-1',
  });

  const s3 = new aws.S3();

  let params = {
    Bucket: awsJson.params.Bucket,
    // Do not change this!
    Prefix: `test/${appName}`,
  };

  s3.listObjects(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      params = { Bucket: awsJson.params.Bucket };
      params.Delete = {};
      params.Delete.Objects = [];

      data.Contents.forEach((content) => {
        params.Delete.Objects.push({ Key: content.Key });
      });

      if (params.Delete.Objects.length > 0) {
        s3.deleteObjects(params, (errMsg, fileData) => console.log(fileData.Deleted.length));
      }
    }
  });
};
