// @flow
// Taken from https://github.com/vacenz/last-draft-js-plugins/blob/1a913e15ef5225b8a4e2253b282af3a5c382e7b0/draft-js-embed-plugin/src/embed/index.js
// slightly adapted to work with arbitrary data passed from the entity
import type { MediaProvider } from '../../helpers/regexps';
import { Entity, EditorState, AtomicBlockUtils } from 'draft-js';
import React, { Component } from 'react';
import isURL from 'validator/lib/isURL';
import { AspectRatio, EmbedContainer, EmbedComponent } from './style';
import { FIGMA_URLS, IFRAME_TAG, MEDIA_PROVIDERS } from '../../helpers/regexps';
import addProtocolToString from 'shared/normalize-url';

export interface ParsedEmbed {
  url: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
}

// Taken from https://github.com/vacenz/last-draft-js-plugins/blob/master/draft-js-embed-plugin/src/modifiers/addEmbed.js
// adapted to pass additional attrs onto the iframe
export const addEmbed = (
  editorState: Object,
  attrs: ParsedEmbed | null
): Object => {
  const urlType = 'embed';
  const entityKey = Entity.create(urlType, 'IMMUTABLE', {
    src: (attrs && attrs.url) || null,
    aspectRatio: attrs && attrs.aspectRatio,
    width: attrs && attrs.width,
    height: attrs && attrs.height,
  });
  const newEditorState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    ' '
  );
  return EditorState.forceSelection(
    newEditorState,
    editorState.getCurrentContent().getSelectionAfter()
  );
};

export const parseEmbedUrl = (incomingUrl: string): ParsedEmbed | null => {
  const isIframeTag = incomingUrl.match(IFRAME_TAG);
  if (isIframeTag)
    return {
      url: IFRAME_TAG.exec(incomingUrl)[2],
    };

  const url = addProtocolToString(incomingUrl);

  const isFigmaUrl = url.match(FIGMA_URLS);
  if (isFigmaUrl)
    return {
      url: `https://www.figma.com/embed?embed_host=spectrum&url=${url}`,
      aspectRatio: '56.25%', // 16:9 aspect ratio
    };

  if (!isURL(url)) return null;

  const mediaProvider = MEDIA_PROVIDERS.map((provider: MediaProvider) => {
    let match;
    if (Array.isArray(provider.regex)) {
      const findRegex = provider.regex
        .map(regex => new RegExp(regex).exec(url))
        .filter(match => match);
      match = findRegex && findRegex.length ? findRegex[0] : null;
    } else {
      match = new RegExp(provider.regex).exec(url);
    }
    return {
      match,
      provider,
    };
  })
    .filter(result => result.match)
    .reduce(item => item);

  if (mediaProvider && mediaProvider.match && mediaProvider.match.length) {
    if (typeof mediaProvider.provider.url === 'function') {
      return {
        ...mediaProvider.provider,
        url: mediaProvider.provider.url(url),
      };
    }

    const result = mediaProvider.match;
    let replacedUrl = mediaProvider.provider.url;
    const replacements = replacedUrl.match(/{\$([A-Z]+)}/);

    replacements.forEach(replacement => {
      replacedUrl = replacedUrl.replace(
        `{$${replacement}}`,
        result.groups[replacement]
      );
    });

    if (mediaProvider.provider.query) {
      const query = mediaProvider.provider.query;
      const queryToAdd = typeof query === 'function' ? query(url) : query;
      replacedUrl = `${replacedUrl}?${queryToAdd}`;
    }

    return {
      ...mediaProvider.provider,
      url: replacedUrl,
    };
  }

  return {
    url,
  };
};

export default class Embed extends Component {
  render() {
    const { block, theme = {}, ...otherProps } = this.props;
    // leveraging destructuring to omit certain properties from props
    const {
      blockProps, // eslint-disable-line no-unused-vars
      customStyleMap, // eslint-disable-line no-unused-vars
      customStyleFn, // eslint-disable-line no-unused-vars
      decorator, // eslint-disable-line no-unused-vars
      forceSelection, // eslint-disable-line no-unused-vars
      offsetKey, // eslint-disable-line no-unused-vars
      selection, // eslint-disable-line no-unused-vars
      tree, // eslint-disable-line no-unused-vars
      contentState,
      blockStyleFn,
      ...elementProps
    } = otherProps;
    const entity = block.getEntityAt(0);
    const data = contentState.getEntity(entity).getData();
    const { aspectRatio, src, width = '100%', height = 200, ...rest } = data;

    if (!src) return null;

    // if an aspect ratio is passed in, we need to use the EmbedComponent which does some trickery with padding to force an aspect ratio. Otherwise we should just use a regular iFrame
    if (aspectRatio && aspectRatio !== undefined) {
      return (
        <AspectRatio ratio={aspectRatio}>
          <EmbedComponent
            title={`iframe-${src}`}
            {...elementProps}
            width={width}
            height={height}
            allowFullScreen={true}
            frameBorder="0"
            {...rest}
            src={src}
            className={theme.embedStyles.embed}
          />
        </AspectRatio>
      );
    } else {
      return (
        <EmbedContainer>
          <iframe
            title={`iframe-${src}`}
            {...elementProps}
            width={width}
            height={height}
            allowFullScreen={true}
            frameBorder="0"
            {...rest}
            src={src}
            className={theme.embedStyles.embed}
            sandbox="allow-popups allow-forms allow-scripts allow-same-origin"
          />
        </EmbedContainer>
      );
    }
  }
}
