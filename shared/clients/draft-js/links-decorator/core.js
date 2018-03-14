// @flow
import React from 'react';
import linkStrategy from 'draft-js-linkify-plugin/lib/linkStrategy';
import normalizeUrl from '../../../normalize-url';
import type { ContentBlock } from 'draft-js/lib/ContentBlock';
import type { ComponentType, Node } from 'react';

type DecoratorComponentProps = {
  decoratedText: string,
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
  strategy: linkStrategy,
  component: ({ decoratedText, children }: DecoratorComponentProps) => (
    <Component
      href={normalizeUrl(decoratedText)}
      children={children}
      /* NOTE(@mxstbr): This is super hacky, but I couldn't find a way to give two URLs in the same message a different key. (i.e. "I am on https://github.com https://github.com is great" would only show the link once) */
      key={`link-${i++}`}
    />
  ),
});

export default createLinksDecorator;
