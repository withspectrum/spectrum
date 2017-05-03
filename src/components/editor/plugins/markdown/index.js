// @flow
import React from 'react';

type Options = {};

const isAtBeginning = state => state.selection.startOffset === 0;
const isHeading = state => state.marks.find(mark => mark.type === 'h1');

const HASHTAG = 51;
const BACKSPACE = 8;

const MarkdownPlugin = (options?: Options) => {
  return {
    schema: {
      marks: {
        h1: props => <h1 {...props.attributes}>{props.children}</h1>,
      },
    },
    onKeyDown(event: KeyboardEvent, data: any, state: Object) {
      console.log(event.which);
      switch (event.which) {
        case HASHTAG: {
          if (!isAtBeginning(state)) return;
          return state.transform().addMark('h1').apply();
        }
        case BACKSPACE: {
          const heading = isHeading(state);
          if (state.selection.startOffset === 1) {
            return state.transform().removeMark('h1').apply();
          }
        }
      }
    },
  };
};

export default MarkdownPlugin;
