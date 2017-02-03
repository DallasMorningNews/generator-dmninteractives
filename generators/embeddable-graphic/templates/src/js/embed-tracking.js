/**
 * This adds Google Analytics tracking to the embeds, sending the parent window
 * information passed down from pym.js as custom dimensions. It also renames
 * the global ga() object to allow the code to be used in tandem with other
 * GA implementations.
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets
 * @see https://github.com/nprapps/pym.js/blob/v1.1.2/src/pym.js#L296-L302
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/renaming-the-ga-object
 */
/* global embedGa:true window:true */


const ANALYTICS_SCRIPT_SRC = '//www.google-analytics.com/analytics.js';
const TRACKING_ID = 'UA-71114055-3';


/**
 * Pluck a URL param's value, by param name, from the page's URL
 * @param {string} name - the name of the URL parameter to pluck
 * @return {string} - an emptry string, if the param is present or the param's
 *   value
 * @see https://davidwalsh.name/query-string-javascript
 */
function getUrlParam(name) {
  const paramName = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${paramName}=([^&#]*)`);
  const results = regex.exec(window.location.search);

  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Strip the protocol, port, query string params and hash from the URL
 * @param {string} url - URL to clean
 * @return {string} - empty string, if the URL is empty or a truncated URL
 * @see https://gist.github.com/jlong/2428561
 */
function cleanUrl(url) {
  if (!url) return '';

  const urlParser = window.document.createElement('a');
  urlParser.href = url;
  return `${urlParser.hostname}${urlParser.pathname}`;
}

/**
 * Append the analyitcs.js tracking code to the page, placing it before the
 * first <script> tag on the page
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/tracking-snippet-reference
 */
function insertAnalyticsTag() {
  const gaTag = window.document.createElement('script');
  const firstScript = window.document.getElementsByTagName('script')[0];
  gaTag.async = 1;
  gaTag.src = ANALYTICS_SCRIPT_SRC;
  firstScript.parentNode.insertBefore(gaTag, firstScript);
}


insertAnalyticsTag();

window.GoogleAnalyticsObject = 'embedGa';

window.embedGa = window.embedGa || ((...args) => {
  (embedGa.q = embedGa.q || []).push(args);
});

embedGa.l = +new Date();

embedGa('create', TRACKING_ID, 'auto');

try {
  embedGa('set', 'dimension1', cleanUrl(getUrlParam('parentUrl')));
  embedGa('set', 'dimension2', getUrlParam('parentTitle'));
  embedGa('set', 'dimension3', getUrlParam('initialWidth'));
} catch (e) {
  embedGa('send', 'exception', {
    exDescription: 'EmbedTrackingError',
    exFatal: false,
  });
}

embedGa('send', 'pageview');
