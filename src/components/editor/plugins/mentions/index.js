// @flow
import React from 'react';

import Portal from './lib/Portal';
import { AT_SIGN, ENTER, SPACE } from './constants';
import { currentlyInMention, findNearestMention } from './utils';
import type {
  Options,
  MentionComponentProps,
  SuggestionsComponentProps,
  SlatePlugin,
} from './types';

const MentionsPlugin = (options?: Options): SlatePlugin => {
  if (!options || !options.Mention || !options.Suggestions) {
    throw new Error(
      '[Slate] [MentionsPlugin] Please provide the Mention and Suggestions components via the options.'
    );
  }
  const { Mention, Suggestions } = options;

  return {
    schema: {
      marks: {
        // Render a mention
        mention: Mention,
      },
    },
    render(props: Object, state: Object, editor: Object) {
      let portal = null;
      if (currentlyInMention(state)) {
        const mention = findNearestMention(
          state.endText.text,
          state.selection.startOffset
        );
        if (mention) {
          portal = (
            <Portal node={state.endBlock}>
              <Suggestions mention={mention} />
            </Portal>
          );
        }
      }
      return (
        <div>
          {props.children}
          {portal}
        </div>
      );
    },
    onKeyDown(event: KeyboardEvent, data: any, state: Object) {
      switch (event.which) {
        // If the user types an @ we add a mark if we're not already in one
        case AT_SIGN: {
          if (currentlyInMention(state)) return;
          return state.transform().addMark('mention').apply();
        }
        // If we're in a mention and either space or enter are pressed
        // jump out of the mention and insert a space
        case SPACE:
          // Need to preventDefault here as we'd otherwise insert two spaces
          if (currentlyInMention(state)) event.preventDefault();
        case ENTER: {
          if (currentlyInMention(state)) {
            return state
              .transform()
              .removeMark('mention')
              .insertText(' ')
              .apply();
          }
        }
      }
    },
  };
};

export default MentionsPlugin;
