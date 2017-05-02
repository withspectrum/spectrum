import React from 'react';
import Portal from './lib/Portal';

const AT_SIGN = 50;
const ENTER = 13;
const SPACE = 32;
const FIRST_MENTION = /@([^\s]+)/;

const currentlyInMention = state =>
  state.marks.some(mark => mark.type === 'mention');

const findNearestMention = (text, end) => {
  // Find the index of the nearest "@" going backwards in text from end index
  // -> "Test @mxstbr| @brian" -> 5 (| = cursor)
  // -> "Test @mxstbr @brian|" -> 13
  const at = text.lastIndexOf('@', end);

  // -> "Test @mxstbr| @brian" -> "@mxstbr @brian"
  // -> "Test @mxstbr @brian|" -> "@brian"
  const textAfterAt = text.slice(at);

  // -> "@mxstbr @brian" -> "@mxstbr"
  // -> "@brian" -> "@brian"
  const name = textAfterAt.match(FIRST_MENTION);

  return !!name && name[1];
};

const MentionsPlugin = options => {
  return {
    schema: {
      marks: {
        // Render a mention
        mention: props => (
          <span
            style={{ background: '#E2197A', color: 'white' }}
            {...props.attributes}
          >
            {props.children}
          </span>
        ),
      },
    },
    render(props, state, editor) {
      let portal = null;
      if (currentlyInMention(state)) {
        const mention = findNearestMention(
          state.endText.text,
          state.selection.startOffset
        );
        if (mention) {
          portal = (
            <Portal node={state.endBlock}>
              <p>Find suggestions for {mention}</p>
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
    onKeyDown(event, data, state) {
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
