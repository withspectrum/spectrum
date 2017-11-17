// @flow

module.exports.MENTIONS = /(\s|^)@[a-z0-9_-]+/gi;
module.exports.URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/gi;
