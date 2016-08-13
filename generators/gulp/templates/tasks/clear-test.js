'use strict';
var gulp = require('gulp'),
    aws = require('aws-sdk'),
    S = require('string');

var awsJson = require('./../../aws.json'),
    meta = require('./../../meta.json'),
    appName = S(meta.name).slugify().s;

module.exports = function() {
  aws.config.update({
        accessKeyId: awsJson.accessKeyId,
        secretAccessKey: awsJson.secretAccessKey,
        region: 'us-east-1'
      });

  var s3 = new aws.S3(),
      params = {
        Bucket: awsJson.params.Bucket,
        // Do not change this!
        Prefix: 'test/' + appName
      };

  s3.listObjects(params, function(err, data) {
    if (err) return console.log(err);

    params = {Bucket: awsJson.params.Bucket};
    params.Delete = {};
    params.Delete.Objects = [];

    data.Contents.forEach(function(content) {
      params.Delete.Objects.push({Key: content.Key});
    });

    if(params.Delete.Objects.length > 0){
      s3.deleteObjects(params, function(err, data) {
        return console.log(data.Deleted.length);
      });
    }

  });
};