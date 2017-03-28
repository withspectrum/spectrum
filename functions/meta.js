const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { parse } = require('url');
const { send } = require('micro');
const { scrapeUrl } = require('metascraper');
const cache = require('memory-cache');
const cors = require('cors')({ origin: true });

const TWENTY_FOUR_HOURS = 86400000;

module.exports.scrape = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    console.log('top', req, res);
    const { query: { url } } = parse(req.url, true);
    if (!url)
      return res.json({
        data: {
          message: 'Please supply an URL to be scraped in the url query parameter.',
        },
      });

    const cachedResult = cache.get(url);
    if (cachedResult) return res.json({ data: cachedResult });

    const getData = url => new Promise((resolve, reject) => {
      scrapeUrl(url).then(data => {
        return resolve(data);
      });
    });

    let statusCode, data;
    try {
      getData(url).then(data => {
        console.log('got data 29', data);
        statusCode = 200;
        return res.json({ data: data });

        // Cache results for 24 hours
        cache.put(url, data, TWENTY_FOUR_HOURS);
      });
    } catch (err) {
      console.log(err);
      console.log('something went wrong 37');
      statusCode = 401;
      data = {
        message: `Scraping the open graph data from "${url}" failed.`,
        suggestion: 'Make sure your URL is correct and the webpage has open graph data, meta tags or twitter card data.',
      };
      return res.json({ data: data });
    }
  });
});
