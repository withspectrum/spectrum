// @flow
import React from 'react';
import linkStrategy from 'draft-js-linkify-plugin/lib/linkStrategy';
import normalizeUrl from '../../../normalize-url';
import type { ContentBlock } from 'draft-js/lib/ContentBlock';
import type { ContentState } from 'draft-js/lib/ContentState';
import type { ComponentType, Node } from 'react';

type DecoratorComponentProps = {
  decoratedText: string,
  contentState: ContentState,
  entityKey?: string,
  children?: Node,
};

export type LinksDecoratorComponentProps = {
  href: string,
  children?: Node,
};

let i = 0;
const createLinksDecorator = (
  Component: ComponentType<LinksDecoratorComponentProps>
) => ({
  strategy: (
    contentBlock: ContentBlock,
    callback: (...args?: Array<any>) => any,
    contentState: ContentState
  ) => {
    if (contentBlock.type === 'code-block') return;

    if (contentBlock.findEntityRanges) {
      contentBlock.findEntityRanges(char => {
        const entityKey = char.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      }, callback);
    }
    linkStrategy(contentBlock, (start, end) => {
      if (
        contentBlock.entityRanges.find(
          range => range.offset === start && range.length === end - start
        )
      )
        return;
      callback(start, end);
    });
  },
  component: ({
    decoratedText,
    children,
    entityKey,
    contentState,
  }: DecoratorComponentProps) => (
    <Component
      href={
        entityKey
          ? contentState.getEntity(entityKey).getData().url
          : normalizeUrl(decoratedText)
      }
      children={children}
      /* NOTE(@mxstbr): This is super hacky, but I couldn't find a way to give two URLs in the same message a different key. (i.e. "I am on https://github.com https://github.com is great" would only show the link once) */
      key={`link-${i++}`}
    />
  ),
});

export default createLinksDecorator;
