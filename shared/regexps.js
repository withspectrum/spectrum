// @flow

module.exports.MENTIONS = /\/?\B@[a-z0-9._-]+[a-z0-9_-]/gi;
module.exports.URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/gi;
module.exports.RELATIVE_URL = /^\/([^\/].*|$)/g;
module.exports.SPECTRUM_URLS = /(?:(?:https?:\/\/)?|\B)(?:spectrum\.chat|localhost:3000)(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/gi;
