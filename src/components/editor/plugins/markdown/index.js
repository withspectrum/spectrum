// @flow
/**
 * Most of this was stolen from https://github.com/ianstormtaylor/slate/blob/460498b5ddfcecee7439eafe4f4d31cacde69f41/examples/markdown-preview/index.js
 */
import React from 'react';
import decorate from './decorator';

type Options = {};

const MarkdownPlugin = (options?: Options) => {
  return {
    schema: {
      marks: {
        title: {
          fontWeight: 'bold',
          fontSize: '20px',
          margin: '20px 0 10px 0',
          display: 'inline-block',
        },
        bold: {
          fontWeight: 'bold',
        },
        italic: {
          fontStyle: 'italic',
        },
        punctuation: {
          opacity: 0.2,
        },
        code: {
          fontFamily: 'monospace',
          display: 'inline-block',
          padding: '2px 1px',
        },
        list: {
          paddingLeft: '10px',
          lineHeight: '10px',
          fontSize: '20px',
        },
        hr: {
          borderBottom: '2px solid #000',
          display: 'block',
          opacity: 0.2,
        },
      },
      rules: [
        {
          match: () => true,
          decorate,
        },
      ],
    },
  };
};

export default MarkdownPlugin;
