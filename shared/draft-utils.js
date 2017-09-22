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
var EditorState = require('draft-js/lib/EditorState');
var ContentState = require('draft-js/lib/ContentState');
var convertFromRaw = require('draft-js/lib/convertFromRawToDraftState');
var convertToRaw = require('draft-js/lib/convertFromDraftStateToRaw');

var toPlainText = function toPlainText(
  editorState /*: typeof EditorState */
) /*: string */ {
  return editorState.getCurrentContent().getPlainText();
};

var fromPlainText = function fromPlainText(
  text /*: string */
) /*: typeof EditorState */ {
  return EditorState.createWithContent(ContentState.createFromText(text));
};

var toJSON = function toJSON(
  editorState /*: typeof EditorState */
) /*: Object */ {
  return convertToRaw(editorState.getCurrentContent());
};

var toState = function toState(json /*: Object */) /*: typeof EditorState */ {
  return EditorState.createWithContent(convertFromRaw(json));
};

module.exports = {
  toJSON: toJSON,
  toState: toState,
  toPlainText: toPlainText,
  fromPlainText: fromPlainText,
};
