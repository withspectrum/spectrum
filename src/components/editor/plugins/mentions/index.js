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

  let search;

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
            <Portal node={state.endText}>
              <Suggestions
                selected={
                  (editor.props.suggestions &&
                    Math.abs(editor.state[SELECTED_MENTION_INDEX_KEY]) %
                      editor.props.suggestions.length) ||
                    0
                }
                suggestions={editor.props.suggestions}
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
            const { suggestions } = editor.props;
            if (suggestions === null) break;

            const selected = Math.abs(editor.state[SELECTED_MENTION_INDEX_KEY]);
            const text = suggestions[selected % suggestions.length || 0];
            const at = nearestAt(
              state.endText.text,
              state.selection.startOffset
            );
            const mentionLength = state.selection.startOffset - at - 1;

            return state
              .transform()
              .deleteBackward(mentionLength)
              .insertText(text)
              .removeMark('mention')
              .insertText(' ')
              .focus()
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
          } else {
            // keycode 48 = "0", keycode 90 = "z", covers all characters
            const currentInput = data.code >= 48 && data.code <= 90
              ? data.key
              : '';
            const mention = findNearestMention(
              `${state.endText.text}${currentInput}`,
              state.selection.startOffset
            );
            editor.props.onMentionSearch(mention);
          }
        }
      }
    },
  };
};

export default MentionsPlugin;
