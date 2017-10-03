// @preval
/**
 * Get the latest commit hash from this git repo, helpful for release tracking in Sentry.
 *
 * This file is shared between server and client.
 * ⚠️ DON'T PUT ANY NODE.JS OR BROWSER-SPECIFIC CODE IN HERE ⚠️
 */

var execSync = require('child_process').execSync;
var commitHash = execSync('git rev-parse --verify HEAD').toString();
module.exports = commitHash;
