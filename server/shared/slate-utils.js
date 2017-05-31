// @flow
/**
 * This file is shared between server and client.
 * ⚠️ DON'T PUT ANY NODE.JS OR BROWSER-SPECIFIC CODE IN HERE ⚠️
 *
 * Note: This uses Flow comment syntax so this whole file is actually valid JS without any transpilation
 * The reason I did that is because create-react-app doesn't transpile files outside the source folder,
 * so it chokes on the Flow syntax.
 * More info: https://flow.org/en/docs/types/comments/
 */
var Raw = require('slate/lib/serializers/raw').default;
var Plain = require('slate/lib/serializers/plain').default;

var toJSON = (state /*: Object */) => Raw.serialize(state, { terse: true });
var toState = (json /*: Object */) => Raw.deserialize(json, { terse: true });

var toPlainText = (state /*: Object*/) => Plain.serialize(state);
var fromPlainText = (string /*: string*/) => Plain.deserialize(string);

module.exports = {
  toJSON,
  toState,
  toPlainText,
  fromPlainText,
};
