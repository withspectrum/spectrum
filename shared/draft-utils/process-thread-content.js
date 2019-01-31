// @flow
import { stateFromMarkdown } from 'draft-js-import-markdown';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import Raven from 'shared/raven';
import { addEmbedsToEditorState } from './add-embeds-to-draft-js';

export default (type: 'TEXT' | 'DRAFTJS', body: string): string => {
  let newBody = body;
  if (type === 'TEXT') {
    newBody = JSON.stringify(
      convertToRaw(
        stateFromMarkdown(newBody, {
          parserOptions: {
            breaks: true,
          },
        })
      )
    );
  }

  // Add automatic embeds to body
  try {
    const editorState = EditorState.createWithContent(
      convertFromRaw(JSON.parse(newBody))
    );
    const newEditorState = addEmbedsToEditorState(editorState);
    return JSON.stringify(convertToRaw(newEditorState.getCurrentContent()));
    // Ignore errors during automatic embed detection
  } catch (err) {
    console.error(err);
    return newBody;
  }
};
