// @flow
import React from 'react';

import Portal from './lib/Portal';
import {
  AT_SIGN,
  ENTER,
  SPACE,
  UP_ARROW,
  DOWN_ARROW,
  SELECTED_MENTION_INDEX_KEY,
} from './constants';
import { currentlyInMention, findNearestMention, nearestAt } from './utils';
import type { Options, SlatePlugin } from './types';

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
        const select = text => {
          const at = nearestAt(state.endText.text, state.selection.startOffset);
          const mentionLength = state.selection.startOffset - at - 1;
          const newState = state
            .transform()
            .deleteBackward(mentionLength)
            .insertText(text)
            .removeMark('mention')
            .insertText(' ')
            .focus()
            .apply();

          editor.onChange(newState);
        };
        const mention = findNearestMention(
          state.endText.text,
          state.selection.startOffset
        );
        if (mention) {
          portal = (
            <Portal node={state.endText}>
              <Suggestions
                selected={editor.state[SELECTED_MENTION_INDEX_KEY] || 0}
                select={select}
                mention={mention}
              />
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
    onKeyDown(event: KeyboardEvent, data: any, state: Object, editor: Object) {
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
        case DOWN_ARROW: {
          if (currentlyInMention(state)) {
            event.preventDefault();
            editor.setState({
              [SELECTED_MENTION_INDEX_KEY]: editor.state[
                SELECTED_MENTION_INDEX_KEY
              ] + 1,
            });
            break;
          }
        }
        case UP_ARROW: {
          if (currentlyInMention(state)) {
            event.preventDefault();
            editor.setState({
              [SELECTED_MENTION_INDEX_KEY]: editor.state[
                SELECTED_MENTION_INDEX_KEY
              ] - 1,
            });
            break;
          }
        }
        default: {
          if (!currentlyInMention(state)) {
            editor.setState({
              [SELECTED_MENTION_INDEX_KEY]: 0,
            });
          }
        }
      }
    },
  };
};

export default MentionsPlugin;
