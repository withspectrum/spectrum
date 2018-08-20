// @flow

module.exports.MENTIONS = /\/?\B@[a-z0-9._-]+[^.\s]\b/gi;
module.exports.URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/gi;
module.exports.RELATIVE_URL = /^\/([^\/].*|$)/g;
